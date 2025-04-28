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