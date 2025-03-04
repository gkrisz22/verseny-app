import { PrismaClient } from "@prisma/client";
import { Service } from "./service";

export class StageService {

    private static instance: StageService;
    private db: PrismaClient;

    public static getInstance(prisma: PrismaClient): StageService {
        if (!StageService.instance) {
            StageService.instance = new StageService(prisma);
        }
        return StageService.instance;
    }

    private constructor(prisma: PrismaClient) {
        this.db = prisma;
    }

    findStageById(id: string) {
        return this.db.stage.findUnique({
            where: {
                id,
            },
        });
    }
}