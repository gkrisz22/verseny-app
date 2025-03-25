"use server";

import { z } from "zod";
import userService from "@/services/user.service";
import { ActionResponse } from "@/types/form/action-response";
import { SignUpFirstStepData, SignUpSchoolContactData, SignUpSchoolSkeletonData, SignUpTeacherData } from "@/types/form/auth";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { OrganizationContactDTO, organizationContactSchema, SignUpSchoolSkeletonDTO, signUpSchoolSkeletonSchema, signUpStepOneSchema } from "@/lib/definitions";
import { logger } from "@/lib/logger";
import { actionHandler } from "@/lib/action.handler";
import authService from "@/services/auth.service";
import organizationService from "@/services/organization.service";

// Actions
export const signUpFirstStep = async (prevState: ActionResponse<SignUpFirstStepData>, formData: FormData) : Promise<ActionResponse<SignUpFirstStepData>> => {
    
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = signUpStepOneSchema.safeParse(rawData);

    logger.debug(JSON.stringify(validatedData.data));

    if (!validatedData.success) {
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: validatedData.error.flatten().fieldErrors,
            inputs: validatedData.data,
        };
    }

    const { email, role } = validatedData.data;
    const res = await userService.getWhere({ email });

    if (res && res.length > 0) {
        logger.debug("Létezik ez a felhasználó.");
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: {
                email: ["Ezzel az e-mail címmel már regisztráltak."],
            }
        };
    }

    const encodedEmail = encodeURIComponent(email);
    redirect(`/sign-up/details?email=${encodedEmail}&role=${role}`);
};

export const signInGithub = async () => {
    await signIn("github");
};
export const signInGoogle = async () => {
    await signIn("google");
};


export const signUpTeacher = async (prevState: ActionResponse<SignUpTeacherData>, formData: FormData) : Promise<ActionResponse<SignUpTeacherData>> => {

    const rawData = Object.fromEntries(formData.entries());
    const schema = z.object({
        email: z.string().email("Hibás e-mail cím formátum!"),
        name: z.string().nonempty("Név megadása kötelező!"),
        password: z.string().min(8, "A jelszó legalább 8 karakter hosszú legyen!"),
        passwordConfirm: z.string().refine((data) => data === rawData.password, {
            message: "A két jelszó nem egyezik meg!",
        }),
        subjects: z.string().nonempty("Tantárgyak megadása kötelező!"),
    });

    const validatedData = schema.safeParse(rawData);
    
    if(!validatedData.success) {
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: validatedData.error.flatten().fieldErrors,
            inputs: validatedData.data,
        };
    }

    const { email, name, password, subjects } = validatedData.data;
    const res = await userService.getWhere({ email });

    if (res) {
        return {
            success: false,
            message: "Validációs hibák történtek.",
            errors: {
                email: ["Ezzel az e-mail címmel már regisztráltak."],
            }
        };
    }

    return {
        success: true,
        message: "Sikeres regisztráció"
    };

};



export const signUpSchoolSkeleton = async (prevState: ActionResponse<SignUpSchoolSkeletonDTO>, formData: FormData) : Promise<ActionResponse<SignUpSchoolSkeletonDTO>> => {

    return actionHandler<SignUpSchoolSkeletonDTO>(signUpSchoolSkeletonSchema, formData, async (data) => {
        const res = await userService.getWhere({ email: data.email });

        if (res && res.length > 0) {
            return {
                success: false,
                message: "Validációs hibák történtek.",
                errors: {
                    email: ["Ezzel az e-mail címmel már regisztráltak."],
                }
            };
        }

        if(data.om && data.om.length > 0)
        {
            const existing = await organizationService.getWhere({ om: data.om });
            if (existing && existing.length > 0) {
                return {
                    success: false,
                    message: "Validációs hibák történtek.",
                    errors: {
                        om: ["Ezzel az OM azonosítóval már regisztráltak egy szervezetet."],
                    }
                };
            }
        }

        const org = await organizationService.create({
            name: data.name,
            om: data.om,
            region: data.region,
            city: data.city,
            postalCode: data.postalCode,
            address: data.address
        });
        if (!org) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }

        
        redirect(`/sign-up/complete/${org.id}`);
    });
};

export const signUpSchoolAdminContact = async (prevState: ActionResponse<OrganizationContactDTO>, formData: FormData) : Promise<ActionResponse<OrganizationContactDTO>> => {

    return actionHandler<OrganizationContactDTO>(organizationContactSchema, formData, async (data) => {
        const org = await organizationService.getWhere({ id: data.id });
        if (!org) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }
        const res = await organizationService.update(data.id, {
            contactEmail: data.email,
            contactName: data.name,
            phoneNumber: data.phone,
        });

        if (!res) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            }
        }

        redirect(`/sign-up/complete/`);     
    });
};