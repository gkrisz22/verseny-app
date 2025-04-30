"use server";

import { actionHandler } from "@/lib/action.handler";
import { HandleOrgUserDTO, handleOrgUserSchema, OrganizationUpdateDTO, organizationUpdateSchema } from "@/lib/definitions";
import competitionService from "@/services/competition.service";
import { ActionResponse } from "@/types/form/action-response";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import userService from "@/services/user.service";
import {
    getSessionOrganizationData,
    isLoggedIn,
    setSecureCookie,
} from "@/lib/utilities";
import { logger } from "@/lib/logger";
import orgService from "@/services/organization.service";
import settingsService from "@/services/settings.service";
import roleMiddleware from "@/middlewares/role.middleware";
import authMiddleware from "@/middlewares/auth.middleware";
import mailerService from "@/services/mailer.service";
import authService from "@/services/auth.service";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";
import { OrganizationStatus } from "@prisma/client";

export const saveRolePreference = async (role: string) => {
    if (!isLoggedIn()) {
        throw new Error("Nincs bejelentkezve.");
    }

    (await cookies()).set("role", role, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    });
    try {
        const orgData = await getSessionOrganizationData();
        if (!orgData) {
            throw new Error("Nincs szervezet kiválasztva.");
        }
        await setSecureCookie({
            name: "org",
            value: JSON.stringify({ ...orgData, role }),
            time: { days: 30 },
        });
    } catch (e) {
        throw new Error("Kérjük, jelentkezzen be újra!");
    }

    redirect(`/org`);
};

export const signedUpForCompetition = async (competitionId: string) => {
    try {
        if (!isLoggedIn()) {
            throw new Error("Nincs bejelentkezve.");
        }
        const orgData = await getSessionOrganizationData();
        if (!orgData) {
            throw new Error("Ön nem része egy szervezetnek sem.");
        }

        return await competitionService.hasOrganization(
            competitionId,
            orgData.id
        );
    } catch (e) {
        console.log(e);
        return false;
    }
};

export async function handleOrgUser(
    _: ActionResponse<HandleOrgUserDTO>,
    formData: FormData
): Promise<ActionResponse<HandleOrgUserDTO>> {
    return actionHandler<HandleOrgUserDTO>(
        handleOrgUserSchema,
        formData,
        async (data) => {
            try {
                let user = null;
                const orgData = await getSessionOrganizationData();
                if (!orgData) {
                    return {
                        success: false,
                        message: "Nincs szervezet kiválasztva.",
                    };
                }
                const orgId = orgData.id;
                if (data.userId) {
                    user = await userService.update(data.userId, {
                        name: data.name,
                        email: data.email,
                        status: data.isActive === "true" ? "ACTIVE" : "INACTIVE",
                    });
                } else {
                    const existingUser = await userService.getWhere({
                        email: data.email,
                    });
                    if (existingUser && existingUser.length > 0) {
                        throw new Error("Ezzel az e-mail címmel már létezik felhasználó.");
                    }
                    user = await userService.create({
                        name: data.name,
                        email: data.email,
                    });
                    await orgService.assignUser(orgId, user.id);

                    const token = uuidv4();
                    await authService.createToken(token, user.id);
                    const sent = await mailerService.sendInviteEmail(data.email, token);
                    if(!sent) {
                        throw new Error("Nem sikerült elküldeni az e-mailt, de a felhasználó létre lett hozva.");
                    }
                }

                await orgService.deleteUserOrgRole(user.id, orgId);
                if (data.roles) {
                    const roles = data.roles.split("&");
                    const roleIds = await settingsService.getRolesByName(roles);
                    if (roleIds && roleIds.length > 0) {
                        await orgService.setUserOrgRoles(
                            user.id,
                            orgId,
                            roleIds.map((r) => r.id)
                        );
                    }
                }
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(e.message);
                    return {
                        success: false,
                        inputs: data,
                        message: e.message,
                    };
                }
            }

            revalidatePath("/org/beallitasok/felhasznalok");
            return {
                success: true,
                message: data.userId ? "Felhasználó módosítva." : "Felhasználó létrehozva.",
            };
        }
    );
}

export async function updateOrganizationData(
    _: ActionResponse<OrganizationUpdateDTO>,
    formData: FormData
): Promise<ActionResponse<OrganizationUpdateDTO>> {
    return actionHandler<OrganizationUpdateDTO>(
        organizationUpdateSchema,
        formData,
        async (data) => {
            try {
                const session = await auth();
                if (!session || !session.user) {
                    throw new Error("Nincs bejelentkezve.");
                }
                const superAdmin = data.isActive !== undefined && !session.user.superAdmin;
                let updateData = null;
                let sendMail = false;
                let org = null;
                if (!session.user.superAdmin){
                  const orgData = await getSessionOrganizationData();
                  if (!orgData) {
                    return {
                      success: false,
                      message: "Nincs szervezet kiválasztva.",
                    };
                  }
                  // data without isActive and id:
                  updateData = {...data,id: orgData.id};
                }
                else {
                    if (!data.id) {
                      throw new Error("Nincs kiválasztva szervezet.");
                    }

                    org = await orgService.get(data.id);
                    if (!org) {
                        throw new Error("Szervezet nem található.");
                    }

                    if(org.status === "PENDING") {
                        sendMail = true;
                    }
                    const isActive = data.isActive === "true";
                    data.isActive = undefined;
                    updateData = {
                        ...data,
                        id: data.id,
                        status: isActive ? ("ACTIVE" as OrganizationStatus) : ("INACTIVE" as OrganizationStatus),
                    };

                }
                await orgService.update(updateData.id!, updateData);

                if (sendMail && org) {
                    const sent = await mailerService.sendOrganizationAcceptedEmail(org);
                    if(!sent) {
                        throw new Error("Nem sikerült elküldeni az e-mailt, de a szervezet létre lett hozva.");
                    }
                }
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(e.message);
                    return {
                        success: false,
                        inputs: data,
                        message: e.message,
                    };
                }
            }

            revalidatePath("/org/beallitasok/szervezet");
            return {
                success: true,
                message: "Szervezet adatai frissítve.",
            };
        },
        [authMiddleware, { handle: (data) => roleMiddleware.handle({ role: "admin"}) }],
    );
}