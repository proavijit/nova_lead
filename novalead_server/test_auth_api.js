const { supabase } = require('./src/config/db');

async function testAuth() {
    console.log('--- Testing Supabase Auth API ---');
    try {
        const email = `auth_test_${Date.now()}@example.com`;
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password: 'password123',
            email_confirm: true
        });

        if (error) {
            console.log('AUTH_ERROR:', error.message, error.status);
        } else {
            console.log('AUTH_SUCCESS! User ID:', data.user.id);
            // If this works, the admin key is fine, meaning PostgREST is the only thing broken.
        }
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

testAuth();
