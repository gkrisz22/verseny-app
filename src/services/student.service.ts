import { Prisma, Student } from "@prisma/client";
import { CrudService, Service } from "./service";
import settingsService from "./settings.service";

export class StudentService extends Service {
    create(data: { name: string; schoolId: string, grade: number, gradeString?: string }) {
        const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
        return this.db.student.create({
            data: {
                name: data.name,
                uniqueId,
                schools: {
                    create: {
                        schoolId: data.schoolId,
                    },
                },
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
        return this.db.student.findMany({
            where: {
                categories: {
                    some: {
                        categoryId,
                    },
                },
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

    
}

const studentService = new StudentService();
export default studentService;