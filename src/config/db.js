const { createClient } = require('@supabase/supabase-js');
const { getEnv } = require('./env');

const env = getEnv();

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = { supabase };
