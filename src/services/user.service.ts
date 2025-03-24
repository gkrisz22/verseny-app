import { Prisma, User } from "@prisma/client";
import { CrudService, Service } from "./service";

export class UserService extends Service implements CrudService<User> {
    constructor() {
        super();
    }

    async create(data: User) {
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

    async getWhere(params: Prisma.UserWhereInput) {
        return this.db.user.findMany({
            where: params,
        });
    }

    async getAll() {
        return this.db.user.findMany(); 
    }
}

const userService = new UserService();
export default userService;

