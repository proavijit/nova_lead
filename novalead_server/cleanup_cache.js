const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * CACHE CLEANUP SCRIPT
 * 
 * This script removes stale "global_search_cache" entries 
 * and their associated "global_cached_leads" to free up database storage.
 * 
 * You can run this file manually via `node cleanup_cache.js` 
 * or set it up as a Cron Job in Vercel/GitHub Actions.
 */

async function cleanupCache() {
    console.log('Starting Cache Cleanup Process...');

    try {
        const expiredCutoff = new Date(); // Current time

        // Prisma's onDelete: Cascade will automatically delete associated leads
        const result = await prisma.globalSearchCache.deleteMany({
            where: {
                expires_at: {
                    lt: expiredCutoff
                }
            }
        });

        console.log(`Successfully deleted ${result.count} expired cache records.`);
    } catch (error) {
        console.error('Error during cache cleanup:', error);
    } finally {
        await prisma.$disconnect();
        console.log('Cleanup complete.');
    }
}

// Run the script if executed directly
if (require.main === module) {
    cleanupCache();
}

module.exports = { cleanupCache };
