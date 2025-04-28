import { Prisma, Student } from "@prisma/client";
import { CrudService, Service } from "./service";
import settingsService from "./settings.service";
import { randomBytes } from 'crypto';

export class StudentService extends Service {
    generateSecureCode() {
        const numbers = '0123456789';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Véletlenszerűen választunk a karaktereket
        const pickRandom = (chars: string, count: number) => {
            let result = '';
            const bytes = randomBytes(count);
            for (let i = 0; i < count; i++) {
                result += chars[bytes[i] % chars.length];
            }
            return result;
        };

        // 3 számot és 3 betűt választunk véletlenszerűen
        const selected = (pickRandom(numbers, 3) + pickRandom(letters, 3)).split('');

        // Véletlenszerűen összekeverjük a kiválasztott karaktereket
        for (let i = selected.length - 1; i > 0; i--) {
            const j = Math.floor(randomBytes(1)[0] / 256 * (i + 1));
            [selected[i], selected[j]] = [selected[j], selected[i]];
        }

        return selected.join('');
    }

    async create(data: { name: string; schoolId: string, grade: number, gradeString?: string }) {
        let uniqueId = "";
        let found = true;
        do {
            uniqueId = this.generateSecureCode();
            const r = await this.db.student.findUnique({
                where: {
                    uniqueId,
                },
            });
            found = r !== null;
        } while (found);

        return this.db.student.create({
            data: {
                name: data.name,
                uniqueId,
                schools: {
                    create: {
                        schoolId: data.schoolId,
                    },
                },
                grade: data.grade,
                gradeString: data.gradeString,
            }
        })
    }
    update(id: string, data: Prisma.StudentUpdateInput)  {
        return this.db.student.update({
            where: {
                id,
            },
            data,
        });
    }

    getWhere(where: Prisma.StudentWhereUniqueInput) {
        return this.db.student.findUnique({
            where,
        });
    }

    async getMany(ids: string[], currentYear?: string) {
        if(!currentYear)
        {
            const currentAYear = await settingsService.getCurrentAcademicYear();
            if(!currentAYear)
                return [];
            currentYear = currentAYear.id;
        }
        return this.db.student.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }
    getAll() {
        return this.db.student.findMany();
    }

    get(id: string) {
        return this.db.student.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
                id: true,
                uniqueId: true,
                createdAt: true,
                updatedAt: true,
                grade: true,
                gradeString: true,
            },
        });
    }

    assignToSchool(studentId: string, schoolId: string) {
        return this.db.student.update({
            where: {
                id: studentId,
            },
            data: {
                schools: {
                    create: {
                        schoolId,
                    },
                },
            },
        });
    }

    async delete(id: string) {
        return this.db.student.delete({
            where: {
                id,
            },
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }


    async getOrganizationStudents(organizationId: string, academicYearId?: string) {
        if(!academicYearId)
        { 
            const currentYear = await settingsService.getCurrentAcademicYear();
            if(!currentYear)
                return [];
            academicYearId = currentYear.id;
        }

        return this.db.student.findMany({
            where: {
                schools: {
                    some: {
                        schoolId: organizationId,
                    },
                }
            },
            include: {
                academicYears: {
                    select: {
                        grade: true,
                    },
                    where: {
                        academicYearId
                    },
                },
            }
        });
    };

    async getCategoryStudents(categoryId: string) {
        return this.db.studentCategory.findMany({
            where: {
                categoryId
            },
        });
    }

    async getStageStudents(stageId: string) {
        return this.db.student.findMany({
            where: {
                stages: {
                    some: {
                        stageId,
                    },
                },
            },
        });
    }

    async updateStageStudent(id: string, data: Prisma.StudentStageUpdateInput) {
        return this.db.studentStage.update({
            where: {
                id,
            },
            data
        })
    }

    assignFilesToStudentStage(studentStageId: string, fileIds: string[]) {
        return this.db.studentStageFile.createMany({
            data: fileIds.map(fileId => ({
                studentStageId,
                fileId
            })),
            skipDuplicates: true,
        });
    }
    
    getStudentStageFiles(studentStageId: string) {
        return this.db.studentStageFile.findMany({
            where: {
                studentStageId,
            },
            include: {
                file: true,
            }
        });
    }

    removeStudentStageFiles(studentStageId: string, fileIds: string[]) {
        return this.db.studentStageFile.deleteMany({
            where: {
                studentStageId,
                fileId: {
                    in: fileIds,
                },
            },
        });
    }
               
}

const studentService = new StudentService();
export default studentService;