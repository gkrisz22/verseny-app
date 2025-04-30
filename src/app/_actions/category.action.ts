"use server";

import { ActionResponse } from "@/types/form/action-response";
import { actionHandler } from "@/lib/action.handler";
import { CategoryEligibilityDTO, categoryEligibilitySchema, competitionSchema, UpdateCategoryMetadataDTO, updateCategoryMetadataSchema} from "@/lib/definitions";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import categoryService from "@/services/category.service";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CategoryFormData } from "@/types/form/competition";
import { z } from "zod";

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

export async function updateCategoryMetadata(prevState: ActionResponse<UpdateCategoryMetadataDTO>, formData: FormData): Promise<ActionResponse<UpdateCategoryMetadataDTO>>
{
    const rawData = Object.fromEntries(formData.entries());
    logger.info("Kategória adatai: ", rawData);
    return actionHandler<UpdateCategoryMetadataDTO>(updateCategoryMetadataSchema, formData, async (data) => {
        try {
            logger.info("Kategória adatai: ", data);
            await categoryService.update(data.categoryId, {
                name: data.name,
                description: data.description,
                published: data.published === "true"
            });
        }
        catch (_) {
            logger.error("Hiba történt a kategória adatainak módosítása közben");
            return {
                success: false,
                message: "Nem sikerült a kategória adatainak módosítása.",
            }
        }
        
        revalidatePath("/");
        return {
            success: true,
            inputs: data,
            message: "Kategória adatai sikeresen módosítva.",
        }
    });
}


export async function deleteCategory(id: string) {
    const category = await categoryService.get(id);
    const compId = category?.competitionId;

    const res = await categoryService.delete(id);
    if(!res) {
        return {
            success: false,
            message: "Hiba történt a versenykategória törlése közben.",
        }
    }
    redirect("/admin/versenyek/" + compId);
}

export async function createCategory(prevState: ActionResponse<CategoryFormData>, formData: FormData): Promise<ActionResponse<CategoryFormData>> {
    const rawData = Object.fromEntries(formData.entries());

    const categorySchema = z.object({
        name: z.string().min(3, "Túl rövid a kategória neve"),
        competitionId: z.string().nonempty("Verseny azonosító nem lehet üres"),
    });

    const validatedData = categorySchema.safeParse(rawData);

    if(!validatedData.success){
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: validatedData.error.flatten().fieldErrors,
            inputs: validatedData.data
        };
    }

    const { name, competitionId } = validatedData.data;

    const res = await db.category.create({
        data: {
            name,
            competitionId,
            description: "",
        },
    });

    revalidatePath("/");

    return {
        success: true,
        message: "Versenykategória létrehozva.",
    }
}
