require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('--- NovaLead Data Seeder ---');

    // Since we can't run the full schema.sql (DDL) via the standard JS client without an RPC,
    // we first remind the user to run the SQL in the dashboard.
    console.log('NOTE: Please ensure you have run the scripts/setup_db.sql in your Supabase SQL Editor first.');

    try {
        // 1. Check if user exists
        const testEmail = 'test_user@example.com';
        const { data: existing } = await supabase.from('users').select('id').eq('email', testEmail).single();

        if (!existing) {
            console.log(`Creating test user: ${testEmail}...`);
            const { data: newUser, error: createError } = await supabase.from('users').insert({
                email: testEmail,
                password_hash: '$2a$10$wR.N/o6mIeNIsL7Z9D7DbeB28s2Q/mK6C9x3eGf6xJ5uV7Yp2k8m.', // password123
                credits: 50
            }).select().single();

            if (createError) throw createError;
            console.log('Test user created successfully.');
        } else {
            console.log('Test user already exists.');
        }

        console.log('Database seeding completed (Initial Data).');
    } catch (error) {
        console.error('Seeding error:', error.message);
        if (error.code === 'PGRST205') {
            console.error('\n[CRITICAL] Tables not found. You MUST run scripts/setup_db.sql in the Supabase Dashboard SQL Editor!');
        }
    }
}

seed();
