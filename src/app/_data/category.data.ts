import categoryService from "@/services/category.service"

export const getEligibleGrades = async (categoryId: string): Promise<number[]> => {
    const res = await categoryService.getEligibleGrades(categoryId);
    return res?.eligibleGrades || [];
}