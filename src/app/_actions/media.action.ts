"use server";

import { auth } from "@/auth";
import mediaService from "@/services/media.service";
import { ActionResponse } from "@/types/form/action-response";
import { revalidatePath } from "next/cache";
import jwt, { SignOptions } from "jsonwebtoken";
import { actionHandler } from "@/lib/action.handler";
import { MediaUploadDTO, mediaUploadSchema } from "@/lib/definitions";
import authMiddleware from "@/middlewares/auth.middleware";

export async function uploadFiles(
    prevState: ActionResponse<MediaUploadDTO>,
    formData: FormData
): Promise<ActionResponse<MediaUploadDTO>> {
    const rawData = Object.fromEntries(formData.entries());
    console.log("Raw data:", rawData);
    return actionHandler<MediaUploadDTO>(
        mediaUploadSchema,
        formData,
        async (data) => {
            const savedFiles = [];
            try {
                const files = formData.getAll("files") as File[];
                const session = await auth();
                if (!session || !session.user || !session.user.id) {
                    throw new Error("Érvénytelen munkamenet. Kérem jelentkezzen be újra!");   
                }

                console.log("Fájlok:", files);
                for (let i = 0; i < files.length; i++) {
                    savedFiles.push(
                        await mediaService.uploadFile(files[i], session.user.id)
                    );
                }
                    }
            
            catch (error) {
                if (error instanceof Error) {
                    return {
                        success: false,
                        message: error.message,
                    };
                }
            }

            revalidatePath("/");
            return {
                success: true,
                message: savedFiles.length + " fájl feltöltve.",
            };
            
        }, [authMiddleware]);
}
export async function getMediaFiles() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return {
            success: false,
            message: "Érvénytelen munkamenet. Kérem jelentkezzen be újra!",
        };
    }
    if (session.user.isSuperAdmin) {
        return await mediaService.getAllFiles();
    }
    return await mediaService.getUserFiles(session.user.id);
}

export async function downloadFile(fileId: string) {
    const secret = process.env.JWT_DOWNLOAD_SECRET || "secret";
    const expiresIn = process.env.JWT_DOWNLOAD_EXPIRES || "2m";

    const token = jwt.sign({ fileId }, secret, {
        expiresIn: expiresIn as SignOptions["expiresIn"],
    });

    const url = `/api/download?token=${token}`;

    return {
        success: true,
        url: url.toString(),
    };
}
