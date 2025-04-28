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
        return this.db.stageFile.findMany({
            where: {
                stageId,
            },
            include: {
                file: true,
            },
        });
    }

    assignFilesToStage(stageId: string, fileIds: string[]) {
        return this.db.stageFile.createMany({
            data: fileIds.map(fileId => ({
                stageId,
                fileId
            })),
            skipDuplicates: true,
        });
    }

    removeFiles(stageId: string, fileIds: string[]) {
        return this.db.stageFile.deleteMany({
            where: {
                stageId,
                fileId: {
                    in: fileIds,
                },
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

    assignStudentsToStage(stageId: string, students: { studentId: string, organizationId: string }[]) {
        return this.db.stage.update({
            where: {
                id: stageId,
            },
            data: {
                students: {
                    createMany: {
                        data: students.map((s) => ({
                            studentId: s.studentId,
                            organizationId: s.organizationId,
                        })),
                        skipDuplicates: true,
                    },
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
                        files: {
                            include: {
                                file: true,
                            },
                        }
                    },                    
                },
            },
        });
    }
    getStageStudentsByOrganization(stageId: string, organizationId: string) {
        return this.db.stage.findUnique({
            where: {
                id: stageId,
            },
            include: {
                students: {
                    include: {
                        student: true,
                        files: {
                            include: {
                                file: true,
                            },
                        },
                    },
                    where: {
                        organizationId: organizationId,
                    },
                },
            },
        });
    }
    getStageStudentsOverPoints(stageId: string, points: number) {
        console.log("Points: ", points);
        return this.db.stage.findUnique({
            where: {
                id: stageId,
            },
            include: {
                students: {
                    select: {
                        studentId: true,
                        totalPoints: true,
                        organizationId: true,
                    },
                    where: {
                        totalPoints: {
                            gte: points,
                        },
                    },
                }
            }
        })
    }
}

const stageService = new StageService();
export default stageService;
