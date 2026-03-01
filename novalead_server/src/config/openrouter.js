const axios = require('axios');
const { getEnv } = require('./env');

// IMPORTANT: Do NOT bake the API key into axios.create() headers.
// On Vercel serverless cold starts, process.env may not be fully populated
// at module-load time, causing Authorization: "Bearer undefined" permanently
// for that function invocation. Instead, use a request interceptor that reads
// the key fresh on every request.

const env = getEnv();

const openrouter = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  timeout: env.OPENROUTER_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-app.com',
    'X-Title': 'Lead Prospecting SaaS'
  }
});

// Set Authorization header dynamically on every request to avoid stale/missing
// keys from cold-start module caching.
openrouter.interceptors.request.use((config) => {
  const currentEnv = getEnv();
  const key = currentEnv.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

  if (!key) {
    console.error('[OpenRouter] OPENROUTER_API_KEY is missing at request time.');
  } else {
    // Aggressively clean the key: strip newlines, carriage returns, quotes, spaces
    const cleanKey = key.replace(/[\r\n"'\s]/g, '');
    if (cleanKey !== key) {
      console.warn('[OpenRouter] API key contained whitespace/newline chars that were stripped.');
    }
    config.headers.Authorization = `Bearer ${cleanKey}`;
  }

  // Debug logging for production diagnosis (safe: only logs prefix)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const authHeader = config.headers.Authorization || '(not set)';
    const prefix = authHeader.startsWith('Bearer ')
      ? `Bearer ${authHeader.slice(7, 20)}...`
      : authHeader.slice(0, 20) + '...';
    console.log('[OpenRouter] Outgoing request Authorization prefix:', prefix);
    console.log('[OpenRouter] Target URL:', config.baseURL + (config.url || ''));
  }

  return config;
});

module.exports = openrouter;
