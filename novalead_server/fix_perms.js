const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixPermissions() {
    console.log('Restoring Supabase schema permissions...');
    try {
        await prisma.$executeRawUnsafe(`GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;`);
        await prisma.$executeRawUnsafe(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;`);
        await prisma.$executeRawUnsafe(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;`);
        await prisma.$executeRawUnsafe(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;`);
        await prisma.$executeRawUnsafe(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;`);
        console.log('Permissions restored successfully!');
    } catch (error) {
        console.error('Error fixing permissions:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixPermissions();
