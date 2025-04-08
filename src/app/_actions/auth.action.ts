"use server";

import { z } from "zod";
import userService from "@/services/user.service";
import { ActionResponse } from "@/types/form/action-response";
import { SignUpFirstStepData, SignUpSchoolContactData, SignUpSchoolSkeletonData, SignUpTeacherData } from "@/types/form/auth";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { OrganizationContactDTO, organizationContactSchema, SignInDTO, signInSchema, SignUpEmailDTO, signUpEmailSchema, SignUpSchoolSkeletonDTO, signUpSchoolSkeletonSchema, signUpSkeletonComplete, SignUpSkeletonCompleteDTO, SignUpStepOneDTO, signUpStepOneSchema } from "@/lib/definitions";
import { logger } from "@/lib/logger";
import { actionHandler } from "@/lib/action.handler";
import authService from "@/services/auth.service";
import organizationService from "@/services/organization.service";
import { v4 as uuid4 } from "uuid";
import { accountMailer } from "@/lib/mailer.lib";
import bcrypt from "bcryptjs";
import roleService from "@/services/role.service";
import { cookies } from "next/headers";

export const signUpFirstStep = async (prevState: ActionResponse<SignUpStepOneDTO>, formData: FormData) : Promise<ActionResponse<SignUpStepOneDTO>> => {
    
    return actionHandler<SignUpStepOneDTO>(signUpStepOneSchema, formData, async (data) => {
        const { role } = data;

        if (role === "teacher") {
            redirect("/sign-up/teacher");
        } else if (role === "school") {
            redirect("/sign-up/organization");
        } else {
            redirect("/sign-up/student");
        }
    });
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

    const rawData = Object.fromEntries(formData.entries());
    logger.info("signUpSchoolSkeleton", rawData);

    return actionHandler<SignUpSchoolSkeletonDTO>(signUpSchoolSkeletonSchema, formData, async (data) => {

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

        const { auth } = data;

        switch (auth) {
            case "google":
                await signIn("google", {
                    redirectTo: `/sign-up/organization/complete/${org.id}`
                });
                break;
            case "github":
                await signIn("github", {
                    redirectTo: `/sign-up/organization/complete/${org.id}`
                });
                break;
        }

        redirect(`/sign-up/email?org=${org.id}`);
    });
};

export const signUpSchoolAdminContact = async (prevState: ActionResponse<OrganizationContactDTO>, formData: FormData) : Promise<ActionResponse<OrganizationContactDTO>> => {

    return actionHandler<OrganizationContactDTO>(organizationContactSchema, formData, async (data) => {
        const org = await organizationService.getWhere({ id: data.id });
        if (!org) {
            console.log("org", org);
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

export const signUpEmail = async (prevState: ActionResponse<SignUpEmailDTO>, formData: FormData) : Promise<ActionResponse<SignUpEmailDTO>> => {
    
    return actionHandler<SignUpEmailDTO>(signUpEmailSchema, formData, async (data) => {
        const { email, name, orgId } = data;

        const org = await organizationService.getWhere({ id: orgId });
        if (!org || org.length === 0) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }

        const existing = await authService.getWhere({ email });

        if(existing && existing.length > 0) {
            return {
                success: false,
                message: "Validációs hibák történtek.",
                errors: {
                    email: ["Ezzel az e-mail címmel már regisztráltak."],
                },
                inputs: { email, name, orgId }
            };
        }

        const res = await authService.create({ email, name });

        if (!res) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }

        if(orgId) {
            const assignToOrg = await organizationService.assignUser(orgId, res.id);
            if (!assignToOrg) {
                return {
                    success: false,
                    message: "Hiba történt a regisztráció során.",
                };
            }
        }
        
        const token = uuid4();
        await authService.createToken(token, res.id);
        const sent = await accountMailer.sendVerificationEmail(email, token);
        if(!sent) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }

        redirect(`/sign-up/sent/?email=${email}`);
    });
}

export const signUpCompleteAction =  async (prevState: ActionResponse<SignUpSkeletonCompleteDTO>, formData: FormData) : Promise<ActionResponse<SignUpSkeletonCompleteDTO>> => {
    return actionHandler<SignUpSkeletonCompleteDTO>(signUpSkeletonComplete, formData, async (data) => {

        const { userId } = data;
        if(!userId) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            }; 
        }
        const user = await authService.getWhere({ id: data.userId });
        if (!user) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }
        const userOrgs = await organizationService.getUserOrgs(userId);
        if(!userOrgs || userOrgs.length === 0) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }
        const userOrg = userOrgs[0].id;
        const org = await organizationService.getWhere({ id: userOrg });
            if (!org || org.length === 0) {
                return {
                    success: false,
                    message: "Hiba történt a regisztráció során.",
            };
        }
        const password = await bcrypt.hash(data.password, 10);
        const updated = await authService.update(data.userId, {
            password
        });

        if (!updated) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }

        const adminRole = await roleService.getWhere({ name: "admin" });

        if (!adminRole) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }
        const role = await organizationService.assignRole(userOrg, data.userId, adminRole.id);
        if(!role) {
            return {
                success: false,
                message: "Hiba történt a regisztráció során.",
            };
        }

        redirect(`/sign-up/completed/`);
    });
}

export const signInAction = async (prevState: ActionResponse<SignInDTO>, formData: FormData) : Promise<ActionResponse<SignInDTO>> => {
    return actionHandler<SignInDTO>(signInSchema, formData, async (data) => {
        const { email, password } = data;
        try {
            await signIn("credentials", {
                email,
                password,
                redirect: false
            });
        }
        catch(e) {
            console.log("Hiba", e);
            return {
                success: false,
                message: "Hibás e-mail cím vagy jelszó!",
                errors: {
                    email: ["Hibás e-mail cím vagy jelszó!"],
                    password: ["Hibás e-mail cím vagy jelszó!"],
                },
                inputs: { email, password }
            };
        }
        const res = await authService.getWhere({ email });
        if (!res || res.length === 0) {
            return {
                success: false,
                message: "Hiba történt a bejelentkezés során.",
            };
        }
        const user = res[0];

        if(!user.superAdmin) {
            const userOrgs = await organizationService.getUserOrgs(user.id);
            if(!userOrgs || userOrgs.length === 0) {
                return {
                    success: false,
                    message: "Hiba történt a bejelentkezés során.",
                };
            }
            const userOrg = userOrgs[0].id;

            const roles = await organizationService.getUserOrgRoles(user.id, userOrg);
            if(!roles || roles.length === 0) {
                return {
                    success: false,
                    message: "Hiba történt a bejelentkezés során.",
                };
            }
            const role = roles[0];
            const cookieStore = await cookies();
            cookieStore.set("role", role.role.name, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/",
            });
            cookieStore.set("org", userOrg, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/",
            });
            
            redirect(`/org`);
        }
        
        redirect("/admin");
    });
};