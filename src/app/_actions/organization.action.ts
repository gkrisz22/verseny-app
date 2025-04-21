"use server";

import { auth } from "@/auth";
import { actionHandler } from "@/lib/action.handler";
import { InviteOrgUserDTO, inviteOrgUserSchema } from "@/lib/definitions";
import competitionService from "@/services/competition.service";
import { ActionResponse } from "@/types/form/action-response";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import authMiddleware from "@/middlewares/auth.middleware";
import { getUserOrganizationId } from "@/lib/validations";
import userService from "@/services/user.service";

export const saveRolePreference = async (orgId: string, role: string) => {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }

    console.log(
        `User ${session?.user?.email} has saved role preference ${role}`
    );

    (await cookies()).set("role", role, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    });

    redirect(`/org`);
};

export const signedUpForCompetition = async (competitionId: string) => {
    try {
        const session = await auth();
        if (!session) {
            throw new Error("Unauthorized");
        }
        const cookieStore = await cookies();
        const organizationId = cookieStore.get("org")?.value as string;
        if (!organizationId) {
            throw new Error("No organization id found");
        }

        return await competitionService.hasOrganization(
            competitionId,
            organizationId
        );
    } catch (e) {
        console.log(e);
        return false;
    }
};

export async function inviteOrgUser(
    _: ActionResponse<InviteOrgUserDTO>,
    formData: FormData
): Promise<ActionResponse<InviteOrgUserDTO>> {
    const rawData = Object.fromEntries(formData.entries());
    console.log("rawData", rawData);
    return actionHandler<InviteOrgUserDTO>(
        inviteOrgUserSchema,
        formData,
        async (data) => {

            const orgId = await getUserOrganizationId();
            console.log("orgId", orgId);
            if (!orgId) {
                return {
                    success: false,
                    message: "Nincs szervezet kiválasztva.",
                };
            }

            const existingUser = await userService.getWhere({
                email: data.email,
            });
            if(existingUser && existingUser.length > 0) {
                return {
                    success: false,
                    inputs: data,
                    message: "Ezzel az email címmel regisztrált felhasználó már létezik.",
                };
            }

            console.log("mindenok", data);
            revalidatePath("/");
            return {
                success: true,
                message: "Felhasználó meghívva!",
            };
        },
    );
}
