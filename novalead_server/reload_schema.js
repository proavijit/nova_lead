const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reloadSchema() {
    console.log('Reloading PostgREST schema cache...');
    try {
        await prisma.$executeRawUnsafe(`NOTIFY pgrst, 'reload schema';`);
        console.log('PostgREST schema cache reloaded successfully!');
    } catch (error) {
        console.error('Error reloading schema cache:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

reloadSchema();
