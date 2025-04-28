import { Prisma } from "@prisma/client";
import { Service } from "./service";
import { OrganizationDTO } from "@/lib/definitions";

export class OrganizationService extends Service {
    constructor() {
        super();
    }

    async create(data: OrganizationDTO) {
        console.log(data);
        return this.db.organization.create({
            data,
        }); 
    }

    async assignUser(orgId: string, userId: string) {
        const organization = await this.db.organization.findUnique({
            where: {
                id: orgId,
            },
        });

        if (!organization) {
            return false;
        }

        const user = await this.db.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return false;
        }

        return this.db.organizationUser.create({
            data: {
                organizationId: orgId,
                userId,
            },
        });
    }

    async assignRole(orgId: string, userId: string, roleId: string) {
        const organizationUser = await this.db.organizationUser.findUnique({
            where: {
                organizationId_userId: {
                    organizationId: orgId,
                    userId: userId,
                },
            },
        });
    
        if (!organizationUser) {
            return false;
        }
    
        return this.db.organizationRole.create({
            data: {
                roleId,
                organizationUserId: organizationUser.id,
            },
        });
    }

    async update(id: string, data: Partial<Prisma.OrganizationUpdateInput>) {
        return this.db.organization.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: string) {
        const res = await this.db.user.delete({
            where: {
                id,
            }, 
        })

        return res ? true : false;
    }

    async get(id: string) {
        return this.db.organization.findUnique({
            where: {
                id,
            },
        });
    }

    async getWhere(params: Prisma.OrganizationWhereInput, include?: Prisma.OrganizationInclude) {
        return this.db.organization.findMany({
            where: params,
            include,
        });
    }

    async getAll() {
        return this.db.organization.findMany({
            include: {
                _count: {
                    select: {
                        members: true,
                    },
                }
            }
        }); 
    }

    async getUserOrgs(userId: string) {
        return this.db.organization.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
        }); 
    }
    async getUserOrgRoles(userId: string, orgId: string) {
        return this.db.organizationRole.findMany({
            where: {
                organizationUser: {
                    organizationId: orgId,
                    userId,
                },
            }, 
            include: {
                role: true,
            },
        })
    }

    async getUsers(orgId: string) {
        return this.db.organizationUser.findMany({
            where: {
                organizationId: orgId,
            },
            include: {
                user: true,
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    async getUserOrgsWithRoles(userId: string) {
        return this.db.organization.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        roles: {
                            include: {
                                role: {
                                    select: {
                                        name: true,
                                        description: true,
                                    }
                                }
                            }
                        }
                    },
                    where: {
                        userId,
                    },
                }
            }
        })
    }
    async deleteUserOrgRole(userId: string, orgId: string) {
        const organizationUser = await this.db.organizationUser.findUnique({
            where: {
                organizationId_userId: {
                    organizationId: orgId,
                    userId: userId,
                },
            },
        }); 
        if (!organizationUser) {
            return false;
        }
        return this.db.organizationRole.deleteMany({
            where: {
                organizationUserId: organizationUser.id,
            },
        });
    }
    async setUserOrgRoles(userId: string, orgId: string, roles: string[]) {
        const organizationUser = await this.db.organizationUser.findUnique({
            where: {
                organizationId_userId: {
                    organizationId: orgId,
                    userId: userId,
                },
            },
        });

        if (!organizationUser) {
            return false;
        }

        return this.db.organizationRole.createMany({
            data: roles.map((role) => ({
                roleId: role,
                organizationUserId: organizationUser.id,
            })),
        });
    };
}

const orgService = new OrganizationService();
export default orgService;

