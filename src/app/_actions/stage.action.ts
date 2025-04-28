"use server";

import { auth } from "@/auth";
import { actionHandler } from "@/lib/action.handler";
import { db } from "@/lib/db";
import {
    CloseStageDTO,
    closeStageSchema,
    EditStageDTO,
    editStageSchema,
    OpenStageDTO,
    openStageSchema,
    UpdateOngoingStageDTO,
    updateOngoingStageSchema,
} from "@/lib/definitions";
import { logger } from "@/lib/logger";
import { isLoggedIn } from "@/lib/utilities";
import stageService from "@/services/stage.service";
import studentService from "@/services/student.service";
import { ActionResponse } from "@/types/form/action-response";
import { TaskFormData } from "@/types/form/competition";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function assignTask(
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
        (file) => !newFiles.includes(file.fileId)
    );
    console.log("I need to delete these files: ", to_delete);
    await stageService.assignFilesToStage(validatedData.data.stageId, newFiles);
    await stageService.removeFiles(
        validatedData.data.stageId,
        to_delete.map((file) => file.fileId)
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
    return actionHandler<CloseStageDTO>(
        closeStageSchema,
        formData,
        async (data) => {
            const update = await stageService.update(data.stageId, {
                minPoints: parseInt(data.points),
                status: "FINISHED",
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
    return actionHandler<OpenStageDTO>(
        openStageSchema,
        formData,
        async (data) => {
            try {
                const stage = await stageService.get(data.stageId)
                if (!stage) {
                    throw new Error("Nem található a megadott forduló.");
                }

                const stages = await stageService.getCategoryStages(
                    stage.categoryId
                );
                const previousStages = stages.filter(
                    (s) => s.startDate < stage.startDate
                );

                if(previousStages.filter(s => s.status === "ONGOING").length > 0) {
                    throw new Error("Egy másik forduló már folyamatban van. Előbb le kell zárnia azt, hogy ezt megnyithassa.");
                }

                const update = await stageService.update(data.stageId, {
                    accessStartDate: data.accessStartDate,
                    status: "ONGOING",
                });
                if (!update) {
                    throw new Error(
                        "Hiba történt a forduló módosítása közben."
                    );
                }
               
                const latestStage = previousStages[previousStages.length - 1];
                if (!latestStage) {
                    const students = await studentService.getCategoryStudents(
                        stage.categoryId
                    );
                    await stageService.assignStudentsToStage(
                        data.stageId,
                        students.map((s) => ({
                            studentId: s.studentId,
                            organizationId: s.organizationId,
                        }))
                    );

                    revalidatePath("/");
                    return {
                        success: true,
                        message:
                            "Forduló létrehozva, diákok hozzárendelve az új fordulóhoz.",
                        inputs: data,
                    };
                }
                const prevStage = await stageService.getStageStudentsOverPoints(
                    latestStage.id,
                    latestStage.minPoints
                );
                if (!prevStage) {
                    throw new Error("Nem található előző forduló.");
                }
                if (prevStage.students.length === 0) {
                    throw new Error("Nincsenek diákok a megadott fordulóhoz.");
                }

                const students = prevStage.students.map((s) => ({
                    studentId: s.studentId,
                    organizationId: s.organizationId || "",
                }));


                await stageService.assignStudentsToStage(
                    data.stageId,
                    students
                );
            } catch (error) {
                if (error instanceof Error) {
                    logger.error("[openStage] ", error);
                    return {
                        success: false,
                        message: error.message,
                        inputs: data,
                    };
                }
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

export async function updateOngoinStage(
    prevState: ActionResponse<UpdateOngoingStageDTO>,
    formData: FormData
): Promise<ActionResponse<UpdateOngoingStageDTO>> {
    return actionHandler<UpdateOngoingStageDTO>(
        updateOngoingStageSchema,
        formData,
        async (data) => {
            try {
                const {
                    accessStartDate,
                    accessEndDate,
                    evaluationStartDate,
                    evaluationEndDate,
                    reevaluationStartDate,
                    reevaluationEndDate,
                } = data;
                await stageService.update(data.id, {
                    accessStartDate,
                    accessEndDate: accessEndDate || null,
                    evaluationStartDate: evaluationStartDate || null,
                    evaluationEndDate: evaluationEndDate || null,
                    reevaluationStartDate: reevaluationStartDate || null,
                    reevaluationEndDate: reevaluationEndDate || null,
                });
            } catch (error) {
                if (error instanceof Error) {
                    logger.error("[updateOngoinStage] ", error);
                    return {
                        success: false,
                        message: error.message,
                        inputs: data,
                    };
                }
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


export async function assignSolutionToStudent(
    studentStageId: string,
    files: string[]
): Promise<boolean> {
    try {
        const studentStageFileSchema = z.object({
            studentStageId: z.string().nonempty(),
            files: z.array(z.string()),
        });

        const validatedData = studentStageFileSchema.safeParse({
            studentStageId,
            files,
        });
        console.log("Validated data: ", validatedData);

        if (!validatedData.success) {
            return false;
        }

        if (!isLoggedIn()) {
            throw new Error("Érvénytelen munkamenet. Jelentkezzen be újra!");
        }
        const newFiles = validatedData.data.files as string[];
        const getStudentFiles = await studentService.getStudentStageFiles(
            validatedData.data.studentStageId
        );
        console.log("Get student files: ", getStudentFiles);
        const to_delete = getStudentFiles.filter(
            (file) => !newFiles.includes(file.fileId)
        );

        await studentService.assignFilesToStudentStage(
            validatedData.data.studentStageId,
            newFiles
        );
        console.log("To delete: ", to_delete);
        await studentService.removeStudentStageFiles(
            validatedData.data.studentStageId,
            to_delete.map((file) => file.fileId)
        );
        console.log("Files assigned to student: ", newFiles);
    } catch (error) {
        if (error instanceof Error) {
            logger.error("[assignSolutionToStudent] ", error);
            return false;
        }
    }

    revalidatePath("/");

    return true;
}