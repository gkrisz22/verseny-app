import organizationService from "@/services/organization.service";
import { cookies } from "next/headers";
import { cache } from "react";

export const getOrganizationUsers = cache(async (orgId?:string) => {
    if(!orgId) {
        const cookieStore = await cookies();
        orgId = cookieStore.get("org")?.value as string;
        console.log("orgId", orgId);
        if (!orgId) {
            return [];
        }
    }
    const users = await organizationService.getUsers(orgId);
    return users;
});