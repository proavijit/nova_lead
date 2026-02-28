const prisma = require('./src/services/prisma.service');
const supabaseService = require('./src/services/supabase.service');

async function verify() {
    process.env.DATABASE_URL = 'postgresql://postgres.xsksfavlzheeygcbqutt:kth4u3dBqIv77ELZ@3.111.105.85:6543/postgres?pgbouncer=true&connection_limit=1';
    console.log('--- Prisma Migration Verification (IP Based Mumbai) ---');

    try {
        // 1. Test connection
        console.log('1. Testing Prisma Connection...');
        const userCount = await prisma.user.count();
        console.log('   Success! Found', userCount, 'users.');

        // 2. Test user lookup
        console.log('2. Testing findUserByEmail...');
        const testEmail = 'avijitghosh649@gmail.com';
        const user = await supabaseService.findUserByEmail(testEmail);
        if (user) {
            console.log('   Success! Found user:', user.email, 'Credits:', user.credits);
        } else {
            console.log('   Warning: Test user not found, but query succeeded.');
        }

        // 3. Test search listing
        if (user) {
            console.log('3. Testing listSearches...');
            const searches = await supabaseService.listSearches(user.id);
            console.log('   Success! Found', searches.total, 'searches.');
        }

        console.log('\n--- VERIFICATION COMPLETE ---');
    } catch (err) {
        console.error('\n--- VERIFICATION FAILED ---');
        console.error(err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
