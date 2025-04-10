"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { CategoryFormData, CompetitionFormData, StageFormData } from "@/types/form/competition";
import { db } from "@/lib/db";
import { ActionResponse } from "@/types/form/action-response";
import { actionHandler } from "@/lib/action.handler";
import { competitionSchema, CompetitionUpdateMetadataDTO, competitionUpdateMetadataSchema } from "@/lib/definitions";
import { logger } from "@/lib/logger";
import competitionService from "@/services/competition.service";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import userService from "@/services/user.service";
import { connect } from "http2";

export async function createCompetition(prevState: ActionResponse<CompetitionFormData>, formData: FormData) : Promise<ActionResponse<CompetitionFormData>>
{
    logger.info("Create competition");
    const rawData = Object.fromEntries(formData.entries());
    logger.debug("FormData", rawData);
    return actionHandler<CompetitionFormData>(competitionSchema, formData, async (validatedData) => {
        const { title, startDate, endDate } = validatedData;
        console.log(title, startDate, endDate);
        if(new Date(startDate) > new Date(endDate)){
            return {
                success: false,
                message: "A kezdő dátum nem lehet nagyobb, mint a befejező dátum.", 
            }   
        } 

        const res = await db.competition.create({
            data: {
                title,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: "UPCOMING",
                description: '',
            }, 
        })

        if(!res){
            return {
                success: false,
                message: "Hiba történt a verseny létrehozása közben.",
            } 
        }

        revalidatePath("/");

        return {
            success: true,
            message: "Verseny létrehozva.",
        }
    });
}

export async function updateCompetitionMetadata(prevState: ActionResponse<CompetitionUpdateMetadataDTO>, formData: FormData): Promise<ActionResponse<CompetitionUpdateMetadataDTO>> {
    
    return actionHandler<CompetitionUpdateMetadataDTO>(competitionUpdateMetadataSchema, formData, async (validatedData) => {
      const { id, title, description } = validatedData;

      const res = await competitionService.update(id, {
        title,
        description,
      });

      if (!res) {
        return {
          success: false,
          inputs: validatedData,
          message: "Hiba történt a verseny frissítése közben.",
        }; 
      }

      revalidatePath("/");

      return {
        success: true,
        inputs: validatedData,
        message: "Verseny frissítve.",
      };
    });
}

/*
export async function getCurrentCompetitions() {
   const res =  await db.competition.findMany({
    select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        status: true,
    }
   });

    return res;
}

export async function getCompetitionById(id: string) {
    const res = await db.competition.findUnique({
        where: {
            id,
        },
    });

    return res;
}*/

export async function updateCompetition(prevState: ActionResponse<CompetitionFormData>, formData: FormData, id: string): Promise<ActionResponse<CompetitionFormData>> {
    const rawData = Object.fromEntries(formData.entries());

    return {
        success: true,
        message: "Verseny frissítve.",
    }

}

export async function deleteCompetition(id: string) {
    const res = await db.competition.delete({
        where: {
            id,
        },
    });

    revalidatePath("/");
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

export async function getCategoriesByCompetitionId(competitionId: string) {
    const res = await db.category.findMany({
        where: {
            competitionId,
        },
    });

    return res;
}

export async function getCategoryById(id: string) {
    const res = await db.category.findUnique({
        where: {
            id,
        },
        include: {
            stages: true,
        }
    });

    return res;
}

export async function createStage(prevState: ActionResponse<StageFormData>, formData: FormData): Promise<ActionResponse<StageFormData>> {
    const rawData = Object.fromEntries(formData.entries());

    const stageSchema = z.object({
        name: z.string().min(3, "Túl rövid a forduló neve"),
        categoryId: z.string().nonempty("Kategória azonosító nem lehet üres"),
    });

    const validatedData = stageSchema.safeParse(rawData);

    if(!validatedData.success){
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: validatedData.error.flatten().fieldErrors,
            inputs: validatedData.data
        };
    }

    const { name, categoryId } = validatedData.data;

    const res = await db.stage.create({
        data: {
            name,
            categoryId,
            description: "",
            startDate: new Date(),
            endDate: new Date(),
        },
    });

    revalidatePath("/");

    return {
        success: true,
        message: "Forduló létrehozva.",
    }
}

export async function getStageById(id: string) {
    const res = await db.stage.findUnique({
        where: {
            id,
        },
        include: {
            files: true
        }
    });

    return res;
}







export async function registerAsOrganization(competitionId: string) {
    const session = await auth();
    console.log(session);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    const user = await userService.getWhere({ email:  session.user.email as string});
    if(!user || user.length === 0){
        throw new Error("User not found");
    }

    const cookieStore = await  cookies();
    const organizationId = cookieStore.get("org")?.value as string;
    console.log(organizationId);
    if(!organizationId){
        throw new Error("Organization not found");
    }

    const res = await db.organizationCompetitionParticipation.create({
        data: {
          competitionId,
          organizationId,
          userId: user[0].id
        }
    });

    return res !== null;
}

export async function getRegisteredOrganizations(competitionId: string) {
    const res = await db.organizationCompetitionParticipation.findMany({
        where: {
            competitionId,
        },
        include: {
            organization: true,
        }
    });
    return res;
}