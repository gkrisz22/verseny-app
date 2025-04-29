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
            ...((!session.user.superAdmin && orgData) && {
                students: {
                    some: {
                        student: {
                            schools: {
                                some: {
                                    schoolId: orgData.id
                                }
                            }
                        }
                    }
                }
            })
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
            files: {
                include: {
                    file: true,
                }
            },
            tasks: true,
            category: true
        }
    });

    return res;
}







export async function registerAsOrganization(competitionId: string) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            throw new Error("Unauthorized");
        }
        const user = await userService.getWhere({ email:  session.user.email as string});
        if(!user || user.length === 0){
            throw new Error("User not found");
        }
    
        const orgData = await getSessionOrganizationData();
        if(!orgData){
            throw new Error("Ön nem tagja egy szervezetnek sem!");
        }
        const organizationId = orgData.id;
        if(!organizationId){
            throw new Error("Organization not found");
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