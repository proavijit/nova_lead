const axios = require('axios');
const { supabase } = require('./src/config/db');

async function inspectSchema() {
    console.log('--- Inspecting Schema ---');
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) {
            console.error('Supabase fetch error:', error);
        } else {
            console.log('User structure:', data[0] ? Object.keys(data[0]) : 'No users found');
            console.log('Sample user:', data[0] || 'N/A');
        }
    } catch (err) {
        console.error('Inspection error:', err);
    }
}

async function testRegister() {
    console.log('--- Testing Register ---');
    try {
        const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
            email: `test_${Date.now()}@example.com`,
            password: 'password123'
        });
        console.log('Success:', response.status, response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.status : error.message);
        console.error('Data:', error.response ? error.response.data : 'N/A');
    }
}

async function run() {
    await inspectSchema();
    await testRegister();
}

run();
