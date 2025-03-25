import { Prisma } from "@prisma/client";
import { CrudService, Service } from "./service";
import { SignUpSchoolSkeletonDTO } from "@/lib/definitions";

export class AuthService extends Service {
    constructor() {
        super();
    }

    async create(data: SignUpSchoolSkeletonDTO) {
        return this.db.organization.create({
            data,
        }); 
    }

    async createOrganization(data: SignUpSchoolSkeletonDTO) {
        
        return this.db.organization.create({
            data,
        });
    }

    async createSchoolSkeleton(data: { name: string, organizationId: string }) {

        return this.db.school.create({
            data,
        });
    }

    async update(id: string, data: Partial<SignUpSchoolSkeletonDTO>) {
        return this.db.user.update({
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

    async getWhere(params: Prisma.UserWhereInput) {
        return this.db.user.findMany({
            where: params,
        });
    }

    async getAll() {
        return this.db.user.findMany(); 
    }
}

const authService = new AuthService();
export default authService;

