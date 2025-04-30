import { Prisma } from "@prisma/client";
import { Service } from "./service";

export class AuthService extends Service {
    constructor() {
        super();
    }

    async create(data: { email: string, name: string, account: Prisma.AccountCreateWithoutUserInput}) {
        return this.db.user.create({
            data: {
                email: data.email,
                name: data.name,
                accounts: {
                    create: data.account,
                },
            },
            include: {
                accounts: true,
            },
        });
    }

    async createToken(token: string, userId: string) {
        return this.db.verificationToken.create({
            data: {
                token,
                userId,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 48), // 48 óra
            },
        });
    }

    async validateToken(token: string) {
        const now = new Date();
        const res = await this.db.verificationToken.findUnique({
            where: {
                token,
            },
        });

        if (!res) {
            return false;
        }

        if (res.expires < now) {
            return false;
        }

        return res;
    }

    async markTokenAsUsed(token: string) {
        return this.db.verificationToken.update({
            where: {
                token,
            },
            data: {
                expires: new Date(),
            },
        });
    }

    async update(id: string, data: Partial<Prisma.UserUpdateInput>) {
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

    async getWithOrg(id: string) {
        return this.db.user.findUnique({
            where: {
                id,
            },
            include: {
                memberships: true,
            },
        });
    }

    async getWhere(params: Prisma.UserWhereInput) {
        return this.db.user.findMany({
            where: params,
        });
    }
    async getByEmail(email: string) {
        return this.db.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async getAll() {
        return this.db.user.findMany(); 
    }
}

const authService = new AuthService();
export default authService;

