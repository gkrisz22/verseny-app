import { Prisma } from "@prisma/client";
import { Service } from "./service";

export class StageService extends Service {
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

    getCategoryStages(categoryId: string) {
        return this.db.stage.findMany({
            where: {
                categoryId,
            },
            orderBy: {
                startDate: "asc",
            },
        });
    }

    update(id: string, data: Prisma.StageUpdateInput) {
        return this.db.stage.update({
            where: {
                id,
            },
            data,
        });
    }

    delete(id: string) {
        return this.db.stage.delete({
            where: {
                id,
            },
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    get(id: string) {
        return this.db.stage.findUnique({
            where: {
                id,
            },
        });
    }

    assignStudentsToStage(stageId: string, studentIds: string[]) {
        return this.db.stage.update({
            where: {
                id: stageId,
            },
            data: {
                students: {
                    create: studentIds.map((studentId) => ({
                        studentId,
                    })),
                },
            },
        });
    }
    getStageStudents(stageId: string) {
        return this.db.stage.findUnique({
            where: {
                id: stageId,
            },
            include: {
                students: {
                    include: {
                        student: true,
                    },
                },
            },
        });
    }
}

const stageService = new StageService();
export default stageService;
