"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { StageService } from "@/services/stage.service";
import { ActionResponse } from "@/types/form/action-response";
import { TaskFormData } from "@/types/form/competition";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function assignTask(prevState: ActionResponse<TaskFormData>, formData: FormData): Promise<ActionResponse<TaskFormData>> {
    const rawData = Object.fromEntries(formData.entries());

    const stageSchema = z.object({
        stageId: z.string().nonempty(),
        files_old: z.any(),
        files_new: z.any()
    });

    const validatedData = stageSchema.safeParse(rawData);

    if (!validatedData.success) {
        return {
            success: false,
            message: "Validációs hiba történt.",
            errors: validatedData.error.flatten().fieldErrors,
            inputs: validatedData.data
        };
    }

    const session = await auth();
    if (!session || !session.user) {
        return {
            success: false,
            message: "Érvénytelen munkamenet. Kérem jelentkezzen be újra!"
        };
    }

    const user = await db.user.findUnique({
        where: {
            email: session.user.email as string,
        },
        select: {
            id: true,
        }
    });

    if (!user) {
        return {
            success: false,
            message: "Felhasználó nem található."
        }
    }

    const newFiles = formData.getAll("files_new") as string[];

    const stageService = StageService.getInstance(db);
    const getStageFiles = await stageService.getStageFiles(validatedData.data.stageId);
    const to_delete = getStageFiles.filter((file) => !newFiles.includes(file.id));

    await stageService.assignFilesToStage(validatedData.data.stageId, newFiles);
    await stageService.removeFiles(validatedData.data.stageId, to_delete.map((file) => file.id));

    revalidatePath("/");

    return {
        success: true,
        message: "Feladatok hozzárendelve.",
    };
}
