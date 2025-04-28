import { logger } from "@/lib/logger";
import { PrismaClient } from "@prisma/client";

export const roleSeeder = async (db:PrismaClient) => {
    const roles = [
        {
            name: "admin",
            description: "Adminisztrátor",
        },
        {
            name: "teacher",
            description: "Tanár",
        },
    ];

    try {
        await db.role.createMany({
            data: roles,
        });
        logger.info("[Seed] Szerepkörök sikeresen létrehozva!");
    } catch (error) {
        logger.error(error as string);
    }
}