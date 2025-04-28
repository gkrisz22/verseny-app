import { getSessionOrganizationData } from "@/lib/utilities";
import organizationService from "@/services/organization.service";
import { cache } from "react";

export const getOrganizationUsers = cache(async (orgId?:string) => {
    if (!orgId) {
        const orgData = await getSessionOrganizationData();
        if (!orgData) {
            return [];
        }
        orgId = orgData.id;
    }
  
    const users = await organizationService.getUsers(orgId);
    return users;
});

export const getOrganizations = cache(async () => {
    const organizations = await organizationService.getAll();
    return organizations;
});

export const getOrganizationData = cache(async (orgId: string) => {
    const organization = await organizationService.get(orgId);
    return organization;
});