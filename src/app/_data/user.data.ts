"use server";

import orgService from "@/services/organization.service";
import userService from "@/services/user.service";
import { Organization } from "@prisma/client";

export const getSuperAdmins = async () => {
    const res = await userService.getWhere({ superAdmin: true });
    return res;
};

export const getUserById = async (id: string) => {
    const res = await userService.getWhere({ id }, { memberships: { include: { organization: true } } });
    if(res.length === 0) {
        return null;
    }
    return { user: res[0], organizations: res[0].memberships.map((membership) => membership.organization) };
};

export const getNormalUsers = async () => {
    const res = await userService.getWhere({ superAdmin: false}, { _count: { select: { memberships: true } } });
    return res;
};

export const getUserOrganizationData = async (id: string): Promise<{ organization: Organization, roles: string[] }[]> => {
    const res = await orgService.getUserOrgsWithRoles(id);

    if(res.length === 0) {
        return [];
    }
    return res.map((org) => {
        return {
            organization: org,
            roles: org.members.length > 0 ? org.members[0].roles.map((role) => role.role.name) : [],
        }
    })

}