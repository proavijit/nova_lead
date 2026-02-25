const axios = require('axios');

async function checkUrl() {
    const url = 'https://xsksfavlzheeygcbqutt.supabase.co/rest/v1/';
    try {
        const response = await axios.get(url, {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza3NmYXZsemhlZXlnY2JxdXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk1NTY4MCwiZXhwIjoyMDg3NTMxNjgwfQ.BVufnZsgPM9_NAz2VrsEFGMI_4xAz0GDFEwSR0RjKNk'
            }
        });
        console.log('API RESPONSE:', response.status);
        console.log('DATA:', JSON.stringify(response.data).slice(0, 500));
    } catch (err) {
        console.log('FETCH ERROR:', err.response ? err.response.status : err.message);
        if (err.response) console.log('ERROR DATA:', err.response.data);
    }
}

checkUrl();
