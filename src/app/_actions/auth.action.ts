"use server";

import userService from "@/services/user.service";
import { ActionResponse } from "@/types/form/action-response";
import { auth, signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import {
    OrganizationContactDTO,
    organizationContactSchema,
    SignInDTO,
    signInSchema,
    SignUpEmailDTO,
    signUpEmailSchema,
    SignUpSchoolSkeletonDTO,
    signUpSchoolSkeletonSchema,
    signUpSkeletonComplete,
    SignUpSkeletonCompleteDTO,
    SignUpSkeletonDTO,
    signUpSkeletonSchema,
    SignUpStepOneDTO,
    signUpStepOneSchema,
    SignUpTeacherDTO,
    signUpTeacherSchema,
} from "@/lib/definitions";
import { logger } from "@/lib/logger";
import { actionHandler } from "@/lib/action.handler";
import authService from "@/services/auth.service";
import organizationService from "@/services/organization.service";
import { v4 as uuid4 } from "uuid";
import bcrypt from "bcryptjs";
import roleService from "@/services/role.service";
import { deleteSecureCookie, getSecureCookie, setSecureCookie } from "@/lib/utilities";
import { getUserOrganizationData } from "../_data/user.data";
import orgService from "@/services/organization.service";
import { cookies } from "next/headers";
import mailerService from "@/services/mailer.service";

export const signUpFirstStep = async (
    prevState: ActionResponse<SignUpStepOneDTO>,
    formData: FormData
): Promise<ActionResponse<SignUpStepOneDTO>> => {
    return actionHandler<SignUpStepOneDTO>(
        signUpStepOneSchema,
        formData,
        async (data) => {
            const { role } = data;

            switch (role) {
                case "school":
                    redirect("/sign-up/organization");
                default:
                    redirect("/sign-up");
            }
        }
    );
};

export const signInGithub = async () => {
    await signIn("github");
};
export const signInGoogle = async () => {
    await signIn("google");
};


export const signUpSchoolSkeleton = async (
    prevState: ActionResponse<SignUpSchoolSkeletonDTO>,
    formData: FormData
): Promise<ActionResponse<SignUpSchoolSkeletonDTO>> => {
    return actionHandler<SignUpSchoolSkeletonDTO>(
        signUpSchoolSkeletonSchema,
        formData,
        async (data) => {
            if (data.om && data.om.length > 0) {
                const existing = await organizationService.getWhere({
                    om: data.om,
                });
                if (existing && existing.length > 0) {
                    return {
                        success: false,
                        message: "Validációs hibák történtek.",
                        errors: {
                            om: [
                                "Ezzel az OM azonosítóval már regisztráltak egy szervezetet.",
                            ],
                        },
                    };
                }
            }

            const org = await organizationService.create({
                name: data.name,
                om: data.om,
                region: data.region,
                city: data.city,
                postalCode: data.postalCode,
                address: data.address,
                contactEmail: data.contactEmail,
            });
            if (!org) {
                return {
                    success: false,
                    message: "Hiba történt a regisztráció során.",
                };
            }

            const { auth: authType } = data;
            console.log("auth", authType);

            await setSecureCookie({
                name: "reg",
                value: JSON.stringify({
                    auth: authType,
                    org: org.id,
                    email: ""
                }),
                time: { minutes: 15 },
            });

            switch (authType) {
                case "google":
                    await signIn("google", {
                        redirectTo: `/sign-up/completed/?oauth=google`,
                    });
                    break;
                case "github":
                        await signIn("github", {
                            redirectTo: `/sign-up/completed/?oauth=github`,
                        });
                    break;
                default:
                    redirect( `/sign-up/email?org=${org.id}`);
            }

            return {
                success: true,
                message: "Sikeres regisztráció",
            };
        }
    );
};

export const signUpEmail = async (
    prevState: ActionResponse<SignUpEmailDTO>,
    formData: FormData
): Promise<ActionResponse<SignUpEmailDTO>> => {
    return actionHandler<SignUpEmailDTO>(
        signUpEmailSchema,
        formData,
        async (data) => {
            const { email, name } = data;
            try {
                const existing = await authService.getWhere({ email });

                if (existing && existing.length > 0) {
                    return {
                        success: false,
                        message: "Validációs hibák történtek.",
                        errors: {
                            email: ["Ezzel az e-mail címmel már regisztráltak."],
                        },
                        inputs: { email, name },
                    };
                }

                const res = await authService.create({ email, name, account: {
                    provider: "email",
                    type: "email",
                    providerAccountId: email,
                }});

                if (!res) {
                    throw new Error("Hiba történt a regisztráció során.");
                }

                const token = uuid4();
                await authService.createToken(token, res.id);
                const sent = await mailerService.sendVerificationEmail(
                    email,
                    token
                );
                if (!sent) {
                    throw new Error("Hiba történt az e-mail küldése során.");
                }

                const cookie = await getSecureCookie("reg");
                if (!cookie) {
                    throw new Error("Hiba történt regisztrációs süti beállítása során.");
                }
                await setSecureCookie({
                    name: "reg",
                    value: JSON.stringify({
                        auth: "email",
                        org: JSON.parse(cookie).org,
                        email,
                    }),
                    time: { minutes: 15 },
                });
            }
            catch (e) {
                logger.error("[signUpEmail] " + (e instanceof Error && e.message));
                return {
                    success: false,
                    message: "Hiba történt a regisztráció során.",
                };
            }
            redirect(`/sign-up/sent/?email=${email}`);
        }
    );
};

export const signUpCompleteAction = async (
    prevState: ActionResponse<SignUpSkeletonCompleteDTO>,
    formData: FormData
): Promise<ActionResponse<SignUpSkeletonCompleteDTO>> => {
    return actionHandler<SignUpSkeletonCompleteDTO>(
        signUpSkeletonComplete,
        formData,
        async (data) => {
            const { userId } = data;
            try {
                if (!userId) {
                    throw new Error("Nem található a felhasználó-azonosító.");
                }
                const user = await authService.get(userId);
                if (!user) {
                    throw new Error("Felhasználó nem található.");
                }
                const password = await bcrypt.hash(data.password, 10);
                const updated = await authService.update(data.userId, {
                    password,
                });

                if (!updated) {
                    throw new Error("Hiba történt a regisztráció során.");
                }

                const userOrgs = await orgService.getUserOrgs(user.id);
                if(user.superAdmin || userOrgs.length > 0) {
                    await setSecureCookie({
                        name: "invite",
                        value: user.id,
                        time: { minutes: 2}
                    })
                }
            }
            catch (e) {
                logger.error("[signUpCompleteAction] " + (e instanceof Error && e.message));
                return {
                    success: false,
                    message: e instanceof Error ? e.message : "Hiba történt a regisztráció során.",
                };
            }

            redirect(`/sign-up/completed/`);
        }
    );
};

export const signInAction = async (
    prevState: ActionResponse<SignInDTO>,
    formData: FormData
): Promise<ActionResponse<SignInDTO>> => {
    return actionHandler<SignInDTO>(signInSchema, formData, async (data) => {
        const { email, password } = data;
        
        try {
            await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
        } catch (e) {
            logger.error("[signInAction] " + (e instanceof Error && e.message));
            return {
                success: false,
                message: "Hibás e-mail cím vagy jelszó!",
                inputs: { email, password },
            };
        }
        redirect("/select");
    });
};
export const signOutAction = async () => {
    await deleteSecureCookie("prg")
    await signOut();
};

export const handleOrgRoleSelect = async (formData:FormData) => {
    const organizationId = formData.get("organizationId");
    const role = formData.get("role");
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return;
    }
    const userOrganizations = await getUserOrganizationData(session.user.id);

    const orgIdx = userOrganizations.findIndex(org => org.organization.id === organizationId);
    if (orgIdx === -1) {
        return;
    }
    const orgRole = userOrganizations[orgIdx].roles.find(r => r.name == role);
    if (!orgRole) {
        return;
    }
    await setSecureCookie({
        name: "org",
        value: JSON.stringify({
            id: organizationId,
            role: role,
        }),
    });
    redirect("/org"); 
}

export const signUpAssignToOrganization = async () => {
    const session = await auth();
    const invite = await getSecureCookie("invite");
    if(invite) {
        return {
            success: true
        }
    }
    const regData = await getSecureCookie("reg");
    if(!regData) {
        return null;
    }

    const { auth: authType, org: orgId, email } = JSON.parse(regData);
    let userEmail = null;
    if(authType !== "email") {
        if(!session || !session.user || !session.user.id) {
            return null;
        }
        userEmail = session.user.email;
    }
    else {
        if(!email) {
            return null;
        }
        userEmail = email;
    }

    if(!userEmail) {
        return null;
    }

    // Felhasználó létezik
    const existingUser = await authService.getWhere({ email: userEmail });
    if (!existingUser || existingUser.length === 0) {
        return null;
    }
    const user = existingUser[0];

    // Felhasználó már tagja egy szervezetnek
    const userOrgs = await organizationService.getUserOrgs(user.id);
    if (userOrgs && userOrgs.length > 0) {
        return null;
    }

    // Szervezet létezik
    console.log("orgId", orgId);
    const existingOrg = await organizationService.getWhere({ id: orgId });
    if (!existingOrg || existingOrg.length === 0) {
        return null;
    }

    // A felhasználó már admin a szervezetben
    const assign = await organizationService.assignUser(orgId, user.id);
    if (!assign) {
        return null;
    }

    // A felhasználó admin szerepkörének hozzárendelése
    const adminRole = await roleService.getWhere({ name: "admin" });
    if (!adminRole) {
        return null;
    }
    const assignRole = await organizationService.assignRole(
        orgId,
        user.id,
        adminRole.id
    );
    if (!assignRole) {
        return null;
    }

    return {
        success: true,
        authType
    }
}