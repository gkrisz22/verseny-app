import { Prisma, User } from "@prisma/client";
import { CrudService, Service } from "./service";
import bcrypt from "bcryptjs";

export class UserService extends Service implements CrudService<User> {
    constructor() {
        super();
    }

    async create(data: Partial<User>) {
        return this.db.user.create({
            data,
        }); 
    }

    async createSkeleton(data: Prisma.UserCreateInput) {
        return this.db.user.create({
            data,
        });
    }

    async update(id: string, data: Partial<User>) {
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

    async getWhere(params: Prisma.UserWhereInput, include: Prisma.UserInclude = {}) {
        return this.db.user.findMany({
            where: params,
            include,
        });
    }

    async getAll() {
        return this.db.user.findMany(); 
    }

    async hashPassword(password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }
    async comparePassword(password: string, hashedPassword: string) {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
}

const userService = new UserService();
export default userService;

