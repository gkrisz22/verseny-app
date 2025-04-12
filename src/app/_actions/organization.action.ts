"use server";

import { auth } from "@/auth";
import competitionService from "@/services/competition.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export const saveRolePreference = async (orgId: string, role: string) => {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }

    console.log(`User ${session?.user?.email} has saved role preference ${role}`);

    (await cookies()).set("role", role, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    });


    redirect(`/org`);
}

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
        
        return await competitionService.hasOrganization(competitionId, organizationId);
    }
    catch (e) {
        console.log(e);
        return false;
    }
    
}