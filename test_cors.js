const axios = require('axios');

async function testCors() {
    const url = 'http://localhost:5000/api/v1/health';
    const origin = 'https://novaleadclient.vercel.app';

    console.log(`Testing OPTIONS request to ${url} from origin ${origin}...`);

    try {
        const optionsRes = await axios({
            method: 'options',
            url: url,
            headers: {
                'Origin': origin,
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type,Authorization'
            }
        });

        console.log('OPTIONS Status:', optionsRes.status);
        console.log('Access-Control-Allow-Origin:', optionsRes.headers['access-control-allow-origin']);
        console.log('Access-Control-Allow-Methods:', optionsRes.headers['access-control-allow-methods']);
        console.log('Access-Control-Allow-Headers:', optionsRes.headers['access-control-allow-headers']);

        if (optionsRes.headers['access-control-allow-origin'] === origin) {
            console.log('✅ CORS OPTIONS test passed!');
        } else {
            console.log('❌ CORS OPTIONS test failed!');
        }

        console.log('\nTesting GET request to health check...');
        const getRes = await axios.get(url, {
            headers: {
                'Origin': origin
            }
        });

        console.log('GET Status:', getRes.status);
        console.log('Access-Control-Allow-Origin:', getRes.headers['access-control-allow-origin']);

        if (getRes.headers['access-control-allow-origin'] === origin) {
            console.log('✅ CORS GET test passed!');
        } else {
            console.log('❌ CORS GET test failed!');
        }

    } catch (error) {
        console.error('Test failed with error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
    }
}

testCors();
