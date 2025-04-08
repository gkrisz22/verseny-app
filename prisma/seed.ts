import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

    const roles = [
        {
            name: "admin",
            description: "Adminisztrátor",
        },
        {
            name: "teacher",
            description: "Tanár",
        },
        {
            name: "contact",
            description: "Kapcsolattartó",
        },
        {
            name: "trusted",
            description: "Megbízott",
        }
    ];

    const res = await prisma.role.createMany({
        data: roles,
    })

    console.log(res);
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