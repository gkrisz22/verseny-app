import { logger } from "@/lib/logger";
import { Prisma, PrismaClient } from "@prisma/client";

export const academicYearSeeder = async (db:PrismaClient) => {
    const count = await db.academicYear.count();
    if (count > 0) {
        logger.info("[Seed] Tanév már létezik.");
        return;
    }
    const academicYear:Prisma.AcademicYearCreateInput = {
        startDate: new Date("2024-09-02"),
        endDate: new Date("2025-06-30"),
        name: "2024/2025"
    }

    try {
        await db.academicYear.create({
            data: academicYear
        });
        logger.info("[Seed] Sikeres tanév létrehozása!");
    } catch (e) {
        logger.error("Nem sikerült létrehozni a tanévet!");
    }
}