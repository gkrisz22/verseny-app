import { PrismaClient } from "@prisma/client";

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

  getStageFiles(stageId: string) {
    return this.db.file.findMany({
      where: {
        stageId,
      },
    });
  }

  assignFilesToStage(stageId: string, fileIds: string[]) {
    return this.db.file.updateMany({
      where: {
        id: {
          in: fileIds,
        },
      },
      data: {
        stageId,
      },
    });
  }

  removeFiles(stageId: string, fileIds: string[]) {
    return this.db.file.updateMany({
      where: {
        id: {
          in: fileIds,
        },
      },
      data: {
        stageId: null,
      },
    });
  }
}