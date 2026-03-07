const ALLOWED_ORIGIN = 'https://novaleadclient.vercel.app';

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

module.exports = (req, res) => {
    // Always set CORS headers first, before anything else
    setCorsHeaders(res);

    // Handle preflight immediately
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    // Try to load and run the Express app
    try {
        const app = require('../src/app');
        app(req, res);
    } catch (err) {
        console.error('Failed to load Express app:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({
            success: false,
            error: 'Server failed to initialize',
            detail: err.message
        }));
    }
};
