"use server";

import { auth } from "@/auth";
import { actionHandler } from "@/lib/action.handler";
import { db } from "@/lib/db";
import { CloseStageDTO, closeStageSchema, EditStageDTO, editStageSchema, OpenStageDTO, openStageSchema } from "@/lib/definitions";
import { logger } from "@/lib/logger";
import categoryService from "@/services/category.service";
import stageService from "@/services/stage.service";
import studentService from "@/services/student.service";
import { ActionResponse } from "@/types/form/action-response";
import { TaskFormData } from "@/types/form/competition";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function assignTask(
    prevState: ActionResponse<TaskFormData>,
    formData: FormData
): Promise<ActionResponse<TaskFormData>> {
    const rawData = Object.fromEntries(formData.entries());

    const stageSchema = z.object({
        stageId: z.string().nonempty(),
        files_old: z.any(),
        files_new: z.any(),
    });

    const validatedData = stageSchema.safeParse(rawData);

    if (!validatedData.success) {
        return {
            success: false,
            message: "Validációs hiba történt.",
            errors: validatedData.error.flatten().fieldErrors,
            inputs: validatedData.data,
        };
    }

    const session = await auth();
    if (!session || !session.user) {
        return {
            success: false,
            message: "Érvénytelen munkamenet. Kérem jelentkezzen be újra!",
        };
    }

    const user = await db.user.findUnique({
        where: {
            email: session.user.email as string,
        },
        select: {
            id: true,
        },
    });

    if (!user) {
        return {
            success: false,
            message: "Felhasználó nem található.",
        };
    }

    const newFiles = formData.getAll("files_new") as string[];

    const getStageFiles = await stageService.getStageFiles(
        validatedData.data.stageId
    );
    const to_delete = getStageFiles.filter(
        (file) => !newFiles.includes(file.id)
    );

    await stageService.assignFilesToStage(validatedData.data.stageId, newFiles);
    await stageService.removeFiles(
        validatedData.data.stageId,
        to_delete.map((file) => file.id)
    );

    revalidatePath("/");

    return {
        success: true,
        message: "Feladatok hozzárendelve.",
    };
}

export async function updateStage(
    prevState: ActionResponse<EditStageDTO>,
    formData: FormData
): Promise<ActionResponse<EditStageDTO>> {
    return actionHandler<EditStageDTO>(
        editStageSchema,
        formData,
        async (data) => {

            const update = await stageService.update(data.stageId, {
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
            });
            if (!update) {
                return {
                    success: false,
                    message: "Hiba történt a forduló módosítása közben.",
                    inputs: data,
                };
            }

            revalidatePath("/");

            return {
                success: true,
                message: "Forduló módosítva.",
            };
        }
    );
}

export async function deleteStage(stageId: string): Promise<boolean> {
    const res = await stageService.delete(stageId);
    revalidatePath("/");
    return res;
}

export async function closeStage(
    prevState: ActionResponse<CloseStageDTO>,
    formData: FormData
): Promise<ActionResponse<CloseStageDTO>> {
    const rawData = Object.fromEntries(formData.entries());
    logger.debug("closeStage", rawData);
    return actionHandler<CloseStageDTO>(
        closeStageSchema,
        formData,
        async (data) => {
            const update = await stageService.update(data.stageId, {
                minPoints: parseInt(data.points),
                status: "FINISHED"
            });
            if (!update) {
                return {
                    success: false,
                    message: "Hiba történt a forduló módosítása közben.",
                    inputs: data,
                };
            }

            revalidatePath("/");
            return {
                success: true,
                message: "Forduló módosítva.",
                inputs: data,
            };
        }
    );
}

export async function openStage(
    prevState: ActionResponse<OpenStageDTO>,
    formData: FormData
): Promise<ActionResponse<OpenStageDTO>> {
    const rawData = Object.fromEntries(formData.entries());
    logger.debug("openStage", rawData);
    return actionHandler<OpenStageDTO>(
        openStageSchema,
        formData,
        async (data) => {
            const update = await stageService.update(data.stageId, {
                accessStartDate: data.accessDate,
                status: "ONGOING"
            });
            if (!update) {
                return {
                    success: false,
                    message: "Hiba történt a forduló módosítása közben.",
                    inputs: data,
                };
            }

            const stage = await stageService.get(data.stageId);

            if(!stage){
                return {
                    success: false,
                    message: "Nem található a megadott forduló.",
                    inputs: data,
                };
            }

            const stages = await stageService.getCategoryStages(stage.categoryId);
            const previousStages = stages.filter((s) => s.startDate < stage.startDate);
            const latestStage = previousStages[previousStages.length - 1];
            if (!latestStage) {
                const students = await studentService.getCategoryStudents(stage.categoryId);
                await stageService.assignStudentsToStage(
                    data.stageId,
                    students.map((s) => s.id)
                );

                return {
                    success: true,
                    message: "Forduló létrehozva, diákok hozzárendelve az új fordulóhoz.",
                    inputs: data,
                }
            }

            const updatedStage = await stageService.getStageStudents(latestStage.id);
            
            if(!updatedStage?.students){
                return {
                    success: false,
                    message: "Nem található a megadott fordulóhoz diák.",
                    inputs: data,
                };
            }
            const students = updatedStage.students.map((s) => ({
                studentId: s.studentId
            }));

            if(students.length === 0){
                return {
                    success: false,
                    message: "Nincsenek diákok a megadott fordulóhoz.",
                    inputs: data,
                }
            }

            await stageService.assignStudentsToStage(data.stageId, students.map((s) => s.studentId));
        

            revalidatePath("/");
            return {
                success: true,
                message: "Forduló módosítva.",
                inputs: data,
            };
        }
    );
}
