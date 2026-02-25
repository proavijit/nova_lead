const { supabase } = require('./src/config/db');

async function checkFunction() {
    console.log('--- Checking for register_user function ---');
    try {
        const { data, error } = await supabase.rpc('register_user', {
            user_email: 'test@check.com',
            user_password_hash: 'hash',
            initial_credits: 10
        });

        if (error) {
            console.log('RPC check failed:', error.code, error.message);
        } else {
            console.log('RPC check success:', data);
        }
    } catch (err) {
        console.error('Critical:', err.message);
    }
    process.exit(0);
}

checkFunction();
