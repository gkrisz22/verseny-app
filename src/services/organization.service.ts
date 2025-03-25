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
        return this.db.user.findUnique({
            where: {
                id,
            },
        });
    }

    async getWhere(params: Prisma.OrganizationWhereInput) {
        return this.db.organization.findMany({
            where: params,
        });
    }

    async getAll() {
        return this.db.user.findMany(); 
    }
}

const orgService = new OrganizationService();
export default orgService;

