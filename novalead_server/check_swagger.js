const axios = require('axios');

async function checkSwagger() {
    const url = 'https://xsksfavlzheeygcbqutt.supabase.co/rest/v1/';
    try {
        const response = await axios.get(url, {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza3NmYXZsemhlZXlnY2JxdXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk1NTY4MCwiZXhwIjoyMDg3NTMxNjgwfQ.BVufnZsgPM9_NAz2VrsEFGMI_4xAz0GDFEwSR0RjKNk'
            }
        });
        const definitions = response.data.definitions || {};
        console.log('EXPOSED TABLES:', Object.keys(definitions).join(', '));
    } catch (err) {
        console.log('FETCH ERROR:', err.message);
    }
}

checkSwagger();
