"use server"

import { auth }                 from "@/auth";
import { db }                   from "@/lib/db";
import mediaService from "@/services/media.service";
import { ActionResponse }       from "@/types/form/action-response";
import { MediaFormData }         from "@/types/form/mediaForm";
import { revalidatePath }       from "next/cache";
import { z }                    from "zod";
import jwt, { SignOptions } from "jsonwebtoken";
import { logger } from "@/lib/logger";

export async function uploadFiles(prevState: ActionResponse<MediaFormData>, formData: FormData): Promise<ActionResponse<MediaFormData>> {
    const rawData = Object.fromEntries(formData.entries());

    const filesSchema = z.object({
        files: z.any()
    });

    const validatedData = filesSchema.safeParse(rawData);

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

    if(!user){
        return {
            success: false,
            message: "Felhasználó nem található."
        }
    }

    const files = formData.getAll("files") as File[];
    const savedFiles = [];

    console.log("Fájlok:", files);
    for (let i = 0; i < files.length; i++) {
        savedFiles.push(
            (await mediaService.uploadFile(files[i], user.id))
        );
    }

    revalidatePath("/");

    return {
        success: true,
        message: savedFiles.length + " fájl feltöltve.",
    }
}

export async function getMediaFiles() {
    logger.debug("getMediaFiles");
    return await mediaService.getAllFiles();
}


export async function downloadFile(formData: FormData) {
    const fileId = formData.get("fileId") as string;
    const secret = process.env.JWT_DOWNLOAD_SECRET || "secret";
    const expiresIn = process.env.JWT_DOWNLOAD_EXPIRES || "2m";

    const token = jwt.sign({ fileId }, secret, {
        expiresIn: expiresIn as SignOptions["expiresIn"]
    });

    const url = `/api/download?token=${token}`;

    return {
        success: true,
        url: url.toString()
    }
}