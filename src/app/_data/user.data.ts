"use server";

import { auth } from "@/auth";
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
    return { user: res[0], organizations: res[0].memberships.map((membership) => membership.organizationId) };
};

export const getNormalUsers = async () => {
    const res = await userService.getWhere({ superAdmin: false}, { _count: { select: { memberships: true } } });
    return res;
};

export const getUserOrganizationData = async (id: string): Promise<{ organization: Organization, roles: {name: string, description:string}[] }[]> => {
    const res = await orgService.getUserOrgsWithRoles(id, { status: "ACTIVE"});

    if(res.length === 0) {
        return [];
    }
    return res.map((org) => {
        return {
            organization: org,
            roles: org.members.length > 0 ? org.members[0].roles.map((role) => ({name: role.role.name, description: role.role.description})) : [],
        }
    })
}

export const getUserProfile = async () => {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return null;
    }
    const res = await userService.get(session.user.id);
    if (!res) {
        return null;
    }
    return res;
};