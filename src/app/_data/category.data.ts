import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getSessionOrganizationData } from "@/lib/utilities";
import categoryService from "@/services/category.service"
import { Organization, Student } from "@prisma/client";

export const getEligibleGrades = async (categoryId: string): Promise<number[]> => {
    const res = await categoryService.getEligibleGrades(categoryId);
    return res?.eligibleGrades || [];
}

export const getAllStudentsInCategory = async (categoryId: string): Promise<(Student & { joinedAt: Date; organization: Partial<Organization> })[]> => {
    const res = await categoryService.getStudentsInCategory(categoryId);
    return res?.students.map((s) => ({ ...s.student, joinedAt: s.createdAt, organization: s.organization })) || [];
}


export async function getCategoriesByCompetitionId(competitionId: string) {
    const res = await db.category.findMany({
        where: {
            competitionId,
        },
        include: {
            _count: {
                select: {
                    stages: true,
                    students: true,
                }
            },
            stages: {
                where: {
                    status: "ONGOING"
                }
            },
        }
    });

    return res.map((category) => {
        return {
            ...category,
            stagesCount: category._count.stages,
            studentsCount: category._count.students,
            currentStage: category.stages.length > 0 ? category.stages[0] : null,
        }
    });
}

export async function getCategoryById(id: string) {
    const session = await auth();
    if(!session || !session.user){
        return null;
    }
    
    const orgData = await getSessionOrganizationData();
    if(!orgData && !session.user.superAdmin){
        return null;
    }

    const res = await db.category.findUnique({
        where: {
            id,
        },
        include: {
            stages: {
                include: {
                    files: {
                        include: {
                            file: true,
                        }
                    },
                    students: {
                        include: {
                            student: true,
                        }
                    }
                },
                orderBy: {
                    startDate: "asc"
                }
            },
            students: {
                include: {
                    student: true,
                },
                where: {
                    student: {
                        schools: {
                            some: {
                                schoolId: {
                                    equals: orgData?.id
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return res;
}