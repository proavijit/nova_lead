const axios = require('axios');
require('dotenv').config();

const EXPLORIUM_API_KEY = process.env.EXPLORIUM_API_KEY;
const EXPLORIUM_BASE_URL = process.env.EXPLORIUM_BASE_URL || 'https://api.explorium.ai';

async function testExplorium() {
    console.log('Testing Explorium API...');
    console.log('URL:', EXPLORIUM_BASE_URL + '/v1/prospects');
    console.log('API Key (first 5):', EXPLORIUM_API_KEY ? EXPLORIUM_API_KEY.slice(0, 5) + '...' : '(missing)');

    try {
        const response = await axios.post(
            `${EXPLORIUM_BASE_URL}/v1/prospects`,
            {
                filters: {
                    company_domain: ["google.com"]
                },
                limit: 1
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    api_key: EXPLORIUM_API_KEY
                }
            }
        );

        console.log('SUCCESS!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error('FAILED!');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Error Data:', JSON.stringify(err.response.data, null, 2));
            console.error('Headers:', JSON.stringify(err.response.headers, null, 2));
        } else {
            console.error('Error Message:', err.message);
            console.error('Error Code:', err.code);
        }
    }
}

testExplorium();
