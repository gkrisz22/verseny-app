"use server";
import { auth } from "@/auth";
import { SaveEvaluationDTO, saveEvaluationSchema } from "@/lib/definitions";
import { logger } from "@/lib/logger";
import { isLoggedIn } from "@/lib/utilities";
import evalService from "@/services/evaluation.service";
import studentService from "@/services/student.service";
import { revalidatePath } from "next/cache";

export async function saveEvaluation({ evaluations }: { evaluations: SaveEvaluationDTO }) {
    try {
        if(!isLoggedIn()) {
            throw new Error("Nincs bejelentkezve!");
        }
        const session = await auth();
        const userId = session?.user?.id || "";

        const data = saveEvaluationSchema.safeParse(evaluations);
        if (!data.success) {
            throw new Error("Hibás adatok érkeztek!");
        }
        evaluations = data.data as { taskId: string, studentId: string, value: number }[];
        for (const evaluation of evaluations) {
            const { taskId, studentId, value } = evaluation;
            const getExisting = await evalService.getWhere({
                taskId,
                stageStudentId: studentId,
                evaluatorId: userId,
            });
            const isEvaluated = getExisting.length > 0;
            const existing = getExisting[0];

            if (isEvaluated) {
                await evalService.update(existing.id, userId, value);
            } else {
                await evalService.create({ taskId, studentId, evaluatorId: userId }, value);
            }
        }
        for (const evaluation of evaluations) {
            const { studentId } = evaluation;
            const totalPoints = await evalService.getTotalPointsByStudentId(studentId);
            if(totalPoints.length === 0) {
                continue;
            }
            const totalPointsValue = totalPoints[0]._sum.points || 0;
            await studentService.updateStageStudent(studentId, {
                totalPoints: totalPointsValue,
                status: "EVALUATED"
            });
        }
    }
    catch (error) {
        if(error instanceof Error) {
            logger.error("[saveEvaluations]: " + error.message);
            throw error;
        }
    }

    revalidatePath("/");
    return {
        success: true,
        message: "Sikeresen mentette az értékelést!",
    };
}