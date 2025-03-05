import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createRole() {
    try {
        const role = await prisma.roles.create({
            data: {
                name: "Пользователь"
            }
        });
    } catch (error) {

    } finally {
        await prisma.$disconnect();
    }
}

createRole();