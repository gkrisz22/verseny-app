import { PrismaClient } from '@prisma/client'
import { roleSeeder } from './seed/roles.seed';
import { academicYearSeeder } from './seed/academicYear.seed';
import { userSeeder } from './seed/users.seed';
const prisma = new PrismaClient()
async function main() {

    await roleSeeder(prisma);
    await academicYearSeeder(prisma);
    await userSeeder(prisma);
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })