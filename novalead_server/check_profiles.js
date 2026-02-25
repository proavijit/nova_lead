const { supabase } = require('./src/config/db');

async function listAllTables() {
    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) {
            console.log('Error selecting from profiles:', error.message);
        } else {
            console.log('Success! profiles table exists and is readable.');
            console.log('Sample data:', data);
        }

        // Try to insert with a slightly different name?
        // No, let's try to find if there's a 'user_profiles' or something.
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

listAllTables();
