import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";


export class MediaService {
    private static instance: MediaService;
    private db: PrismaClient;

    public static getInstance(prisma: PrismaClient): MediaService {
        if (!MediaService.instance) {
            MediaService.instance = new MediaService(prisma);
        }
        return MediaService.instance;
    }

    private constructor(prisma: PrismaClient) {
        this.db = prisma;
    }

    findFileById(id: string) {
        return this.db.file.findUnique({
            where: {
                id,
            },
        });
    }

    async uploadFile(file: File, userId: string) {
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const fsName = uuidv4() + path.extname(file.name);

        const filePath = path.join(uploadDir, fsName);
        const relativePath = path.join('/uploads', fsName);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        const savedFile = await this.db.file.create({
            data: {
                name: file.name,
                path: relativePath,
                size: file.size,
                type: file.type,
                uploadedBy: userId,
                fsName: fsName,
            },
        });

        return savedFile;
    }

    async getAllFiles() {
        return this.db.file.findMany();
    }

    async deleteFile(id: string) {
        const file = await this.db.file.findUnique({
            where: {
                id,
            },
        });

        if (!file) {
            return false;
        }

        const filePath = path.join(process.cwd(), 'public', file.path);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.db.file.delete({
            where: {
                id,
            },
        });

        return true;
    }
}

