const { getEnv } = require('./src/config/env');

async function testEnvRobustness() {
    console.log('--- Testing Env Robustness ---');

    // Backup real env
    const originalEnv = { ...process.env };

    try {
        // Inject malformed values
        process.env.PORT = '5000\\r\\n';
        process.env.SUPABASE_URL = 'https://example.supabase.co\\n';
        process.env.JWT_SECRET = 'a'.repeat(32) + '\\r\\n';
        process.env.OPENROUTER_API_KEY = 'sk-or-v1-test\\n';
        process.env.EXPLORIUM_API_KEY = 'test-key\\r\\n';
        process.env.EXPLORIUM_BASE_URL = 'https://api.explorium.ai\\n';

        const env = getEnv();

        console.log('PORT:', JSON.stringify(env.PORT));
        console.log('SUPABASE_URL:', JSON.stringify(env.SUPABASE_URL));

        if (env.PORT === 5000 && !env.SUPABASE_URL.includes('\\n')) {
            console.log('✅ Success: Malformed values were cleaned correctly.');
        } else {
            console.error('❌ Failure: Malformed values were NOT cleaned correctly.');
            process.exit(1);
        }
    } catch (err) {
        console.error('❌ Failure: getEnv() threw an error:', err.message);
        process.exit(1);
    } finally {
        // Restore original env
        process.env = originalEnv;
    }
}

testEnvRobustness();
