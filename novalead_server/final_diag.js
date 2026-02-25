const { supabase } = require('./src/config/db');

async function checkFinal() {
    console.log('--- FINAL DIAGNOSTIC ---');

    // Test count (we know this works)
    const { count, error: e1 } = await supabase.from('users').select('*', { count: 'exact', head: true });
    console.log('Users count check:', !e1 ? `SUCCESS (${count})` : `FAIL (${e1.code})`);

    // Test specific column (we know this fails)
    const { data: d2, error: e2 } = await supabase.from('users').select('id').limit(1);
    console.log('Users column check (id):', !e2 ? 'SUCCESS' : `FAIL (${e2.code}: ${e2.message})`);

    // Test another table
    const { data: d3, error: e3 } = await supabase.from('profiles').select('id').limit(1);
    console.log('Profiles column check (id):', !e3 ? 'SUCCESS' : `FAIL (${e3.code}: ${e3.message})`);

    process.exit(0);
}

checkFinal();
