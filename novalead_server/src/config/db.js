const { createClient } = require('@supabase/supabase-js');
const { getEnv } = require('./env');

const env = getEnv();

console.log(`[DB] Supabase URL: ${env.SUPABASE_URL}`);
console.log(`[DB] Key starts with: ${env.SUPABASE_SERVICE_ROLE_KEY ? env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) : 'MISSING'}...`);
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    db: {
        schema: 'public'
    }
});

module.exports = { supabase };
