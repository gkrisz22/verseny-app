"use server"

import { auth }                 from "@/auth";
import { db }                   from "@/lib/db";
import { MediaService }   from "@/services/media.service";
import { ActionResponse }       from "@/types/form/action-response";
import { MediaFormData }         from "@/types/form/mediaForm";
import { revalidatePath }       from "next/cache";
import { z }                    from "zod";
import jwt, { SignOptions } from "jsonwebtoken";

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

    console.log("Validált adatok:", validatedData.data);

    const session = await auth();
    if (!session || !session.user) {
        return {
            success: false,
            message: "Érvénytelen munkamenet. Kérem jelentkezzen be újra!"
        };
    }

    console.log("Felhasználói munkamenet:", session);

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
    const fileManager = MediaService.getInstance(db);
    const savedFiles = [];

    for (let i = 0; i < files.length; i++) {
        savedFiles.push(
            (await fileManager.uploadFile(files[i], user.id))
        );
    }

    revalidatePath("/");

    return {
        success: true,
        message: savedFiles.length + " fájl feltöltve.",
    }
}

export async function getMediaFiles() {
    const fileManager = MediaService.getInstance(db);
    return await fileManager.getAllFiles();
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