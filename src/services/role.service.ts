import { Prisma } from "@prisma/client";
import { Service } from "./service";

export class RoleService extends Service {
    constructor() {
        super();
    }

    async getWhere(where: Prisma.RoleWhereUniqueInput) {
        return this.db.role.findUnique({
            where
        });
    }
}

const roleService = new RoleService();
export default roleService;

