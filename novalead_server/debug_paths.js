const axios = require('axios');

async function checkPaths() {
    const url = 'https://xsksfavlzheeygcbqutt.supabase.co/rest/v1/';
    try {
        const response = await axios.get(url, {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza3NmYXZsemhlZXlnY2JxdXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk1NTY4MCwiZXhwIjoyMDg3NTMxNjgwfQ.BVufnZsgPM9_NAz2VrsEFGMI_4xAz0GDFEwSR0RjKNk'
            }
        });
        const paths = response.data.paths || {};
        const tables = Object.keys(paths).filter(p => p !== '/').map(p => p.slice(1));
        console.log('VISIBLE TABLES/PATHS:', tables.join(', ') || 'NONE');

        if (tables.length > 0) {
            const firstTable = tables[0];
            console.log(`Metadata for ${firstTable}:`, JSON.stringify(paths[`/${firstTable}`]).slice(0, 500));
        }
    } catch (err) {
        console.log('FETCH ERROR:', err.message);
    }
}

checkPaths();
