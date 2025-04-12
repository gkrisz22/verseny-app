"use server";

import { ActionResponse } from "@/types/form/action-response";
import { actionHandler } from "@/lib/action.handler";
import { CategoryEligibilityDTO, categoryEligibilitySchema, competitionSchema} from "@/lib/definitions";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import categoryService from "@/services/category.service";

export async function setEligibleGrades(prevState: ActionResponse<CategoryEligibilityDTO>, formData: FormData): Promise<ActionResponse<CategoryEligibilityDTO>>
{
    return actionHandler<CategoryEligibilityDTO>(categoryEligibilitySchema, formData, async (data) => {
        
        try {
            if(!data.grades)
            {
                return {
                    success: false,
                    message: "Nem sikerült az évfolyamok beállítása.",
                }
            }
            const grades = data.grades?.split(",").map((grade) => parseInt(grade)) || [];
            console.log(grades);
            await categoryService.update(data.categoryId, {
                eligibleGrades: grades
            });
        }
        catch (_) {
            logger.error("Hiba történt az évfolyamok beállítása közben");
            return {
                success: false,
                message: "Nem sikerült az évfolyamok beállítása.",
            }
        }
        
        revalidatePath("/");
        return {
            success: true,
            inputs: data,
            message: "Évfolyamok sikeresen beállítva.",
        }
    });
}