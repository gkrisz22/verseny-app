import { logger } from "@/lib/logger";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
export const userSeeder = async (db:PrismaClient) => {

    const count = await db.user.count();
    if (count > 0) {
        logger.info("[userSeeder] Felhasználók már léteznek.");
        return;
    }
    // Super Admin
    const password = "12345678";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const superAdmin:Prisma.UserCreateInput = {
        email: "superadmin@test.local",
        name: "Super Admin",
        password: hashedPassword,
        status: "ACTIVE",
        superAdmin: true,
        emailVerified: new Date()
    };

    await db.user.create({
        data: superAdmin
    })

    logger.info(`[userSeeder] Super admin felhasználó létrehozva: (email: ${superAdmin.email}, jelszó: ${password})`);


    // Org Admin
    const orgData:Prisma.OrganizationCreateInput = {
        name: "Eötvös Loránd Tudományegyetem Informatika Kar",
        region: "budapest",
        postalCode: "1117",
        city: "Budapest",
        address: "Lágymányosi sétány 1 ",
        phoneNumber: "06301111111",
        contactEmail: "admin@bookversum.app",
        contactName: "Admin",
    }

    const org = await db.organization.create({
        data: orgData
    });

    // User:
    const u = await db.user.create({
        data: {
            email: "test@organization.local",
            name: "Organization Admin",
            password: hashedPassword,
            status: "ACTIVE",
            emailVerified: new Date(),
            superAdmin: false
        }
    });

    const orgUser = await db.organizationUser.create({
        data: {
            userId: u.id,
            organizationId: org.id,
        }
    });

    const adminRole = await db.role.findFirst({
        where: {
            name: "admin"
        }
    });

    if (adminRole) {
        await db.organizationRole.create({
            data: {
                organizationUserId: orgUser.id,
                roleId: adminRole.id
            }
        });
        logger.info("[userSeeder] Admin szerepkör hozzáadva az org admin felhasználóhoz!");
    }
    else {
        logger.error("[userSeeder] Admin szerepkör nem található! Lehetséges, hogy előbb lett indítva a user seeder, mint a role seeder.");
    }

}