"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { CategoryFormData, CompetitionFormData, StageFormData } from "@/types/form/competition";
import { db } from "@/lib/db";
import { ActionResponse } from "@/types/form/action-response";
import { actionHandler } from "@/lib/action.handler";
import { CompetitionDTO, competitionSchema, CompetitionUpdateMetadataDTO, competitionUpdateMetadataSchema, UpdateCompetitionDatesDTO, updateCompetitionDatesSchema, UpdateCompetitionSettingsDTO, updateCompetitionSettingsSchema, UpdateCompetitionSignUpDateDTO, updateCompetitionSignUpDateSchema } from "@/lib/definitions";
import { logger } from "@/lib/logger";
import competitionService from "@/services/competition.service";
import { auth } from "@/auth";
import userService from "@/services/user.service";
import { redirect } from "next/navigation";
import categoryService from "@/services/category.service";
import authMiddleware from "@/middlewares/auth.middleware";
import { getSessionOrganizationData } from "@/lib/utilities";

export async function createCompetition(prevState: ActionResponse<CompetitionDTO>, formData: FormData) : Promise<ActionResponse<CompetitionDTO>>
{
    return actionHandler<CompetitionDTO>(competitionSchema, formData, async (validatedData) => {
        const { title, startDate, endDate } = validatedData;

        const res = await competitionService.create({
            title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            description: ""
        });

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
    }, [authMiddleware]);
}

export async function updateCompetitionMetadata(prevState: ActionResponse<CompetitionUpdateMetadataDTO>, formData: FormData): Promise<ActionResponse<CompetitionUpdateMetadataDTO>> {
    
    return actionHandler<CompetitionUpdateMetadataDTO>(competitionUpdateMetadataSchema, formData, async (validatedData) => {
      const { id, title, description, shortDescription } = validatedData;

      const res = await competitionService.update(id, {
        title,
        description,
        shortDescription
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

export async function deleteCompetition(id: string) {
    const res = await competitionService.delete(id);

    if(!res) {
        return {
            success: false,
            message: "Hiba történt a verseny törlése közben.",
        }
    }

    redirect("/admin/versenyek");
}


export async function registerAsOrganization(competitionId: string) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            throw new Error("Nincs bejelentkezve!");
        }
        const user = await userService.getWhere({ email:  session.user.email as string});
        if(!user || user.length === 0){
            throw new Error("Felhasználó nem található!");
        }
    
        const orgData = await getSessionOrganizationData();
        if(!orgData){
            throw new Error("Ön nem tagja egy szervezetnek sem!");
        }
        const organizationId = orgData.id;
        if(!organizationId){
            throw new Error("Szervezet nem található!");
        }
    
        const alreadyRegistered = await db.competitionOrganization.findFirst({
          where: {
            competitionId,
            organizationId,
          },
        });
        if(alreadyRegistered){
            throw new Error("Már regisztrált a kijelölt versenyre.");
        }
    
        const res = await db.competitionOrganization.create({
          data: {
            competitionId,
            organizationId,
            userId: user[0].id,
          },
        });

        revalidatePath("/org");
    }
    catch(err) {
        return {
            success: false,
            message: err instanceof Error ? err.message : "Regisztráció sikertelen",
        }
    }
    return {
        success: true,
        message: "Sikeres regisztráció",
    }
}

export async function getRegisteredOrganizations(competitionId: string) {
    const res = await db.competitionOrganization.findMany({
      where: {
        competitionId,
      },
      include: {
        organization: true,
      },
    });
    return res;
}

export async function updateCompetitionSettings(prevState: ActionResponse<UpdateCompetitionSettingsDTO>, formData: FormData): Promise<ActionResponse<UpdateCompetitionSettingsDTO>> {
    return actionHandler<UpdateCompetitionSettingsDTO>(updateCompetitionSettingsSchema, formData, async (data) => {
        
        try {
            const { competitionStartDate, competitionEndDate, signUpStartDate, signUpEndDate, published} = data;

            const updated = await competitionService.update(data.id, {
                startDate: new Date(competitionStartDate),
                endDate: new Date(competitionEndDate),
                signUpStartDate: new Date(signUpStartDate),
                signUpEndDate: new Date(signUpEndDate),
                published: published === "true",
            });
            if (!updated) {
                throw new Error("Hiba történt a verseny frissítése közben.");
            }
            
        }
        catch(err) {
            if (err instanceof Error) {
                return {
                    success: false,
                    message: err.message,
                    inputs: data,
                }
            }
        }
        revalidatePath("/admin/versenyek/" + data.id);
        return {
            success: true,
            message: "Verseny frissítve.",
        }
    });
}

