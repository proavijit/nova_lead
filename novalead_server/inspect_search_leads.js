const { supabase } = require('./src/config/db');

async function inspectTables() {
    console.log('--- Inspecting Searches Table ---');
    const { data: searchCols, error: searchErr } = await supabase.rpc('get_table_columns', { table_name: 'searches' });
    if (searchErr) {
        console.log('Falling back to select * approach for searches...');
        const { data: searchData, error: searchDataErr } = await supabase.from('searches').select('*').limit(1);
        if (searchDataErr) console.error('Error fetching searches:', searchDataErr.message);
        else console.log('SEARCH COLUMNS:', Object.keys(searchData[0] || {}));
    } else {
        console.log('SEARCH COLUMNS:', searchCols.map(c => c.column_name).join(', '));
    }

    console.log('\n--- Inspecting Leads Table ---');
    const { data: leadCols, error: leadErr } = await supabase.rpc('get_table_columns', { table_name: 'leads' });
    if (leadErr) {
        console.log('Falling back to select * approach for leads...');
        const { data: leadData, error: leadDataErr } = await supabase.from('leads').select('*').limit(1);
        if (leadDataErr) console.error('Error fetching leads:', leadDataErr.message);
        else console.log('LEAD COLUMNS:', Object.keys(leadData[0] || {}));
    } else {
        console.log('LEAD COLUMNS:', leadCols.map(c => c.column_name).join(', '));
    }
}

inspectTables();
