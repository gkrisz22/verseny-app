import { PrismaClient } from "@prisma/client";
import { Service } from "./service";

export class UserService {

    private static instance: UserService;
    private db: PrismaClient;

    public static getInstance(prisma: PrismaClient): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(prisma);
        }
        return UserService.instance;
    }

    private constructor(prisma: PrismaClient) {
        this.db = prisma;
    }

    findUserById(id: string) {
        return this.db.user.findUnique({
            where: {
                id,
            },
        });
    }

    findUserByEmail(email: string) {
        console.log('findUserByEmail', email);
        return this.db.user.findUnique({
            where: {
                email,
            },
        });
    }
}