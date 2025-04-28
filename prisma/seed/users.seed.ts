import { Prisma, PrismaClient } from "@prisma/client";

export const userSeeder = async (db:PrismaClient) => {
    const superAdmin:Prisma.UserCreateInput = {
        email: "g.krisztian0522@gmail.com",
        name: "Super Admin",
        password: "superadmin",
    }
}