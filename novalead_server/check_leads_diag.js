const { supabase } = require('./src/config/db');

async function checkLeads() {
    console.log('--- Checking Leads Table Columns ---');
    try {
        const { data, error } = await supabase.from('leads').select('id').limit(1);
        if (error) {
            console.log('SELECT ID ERROR:', error.message, error.code);
        } else {
            console.log('SELECT ID SUCCESS! Rows:', data.length);
        }
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

checkLeads();
