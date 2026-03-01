const axios = require('axios');
const { getEnv } = require('./env');

const env = getEnv();

const apiKey = env.OPENROUTER_API_KEY;

// Validate key format at startup
if (!apiKey || !apiKey.startsWith('sk-or-')) {
  console.error(
    '[OpenRouter] WARNING: OPENROUTER_API_KEY looks invalid.',
    'Expected prefix "sk-or-", got:',
    apiKey ? `"${apiKey.slice(0, 12)}..." (len=${apiKey.length})` : '(empty/undefined)'
  );
}

const openrouter = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  timeout: env.OPENROUTER_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5000',
    'X-Title': 'NovaLead Prospecting SaaS'
  }
});

// Use a request interceptor so the Authorization header is always read fresh
// from the validated env, not baked in at module-load time.
openrouter.interceptors.request.use((config) => {
  const key = getEnv().OPENROUTER_API_KEY;
  config.headers.Authorization = `Bearer ${key}`;

  if (process.env.VERCEL) {
    console.log('[OpenRouter] Outgoing request:', {
      url: config.url,
      authHeaderPrefix: config.headers.Authorization
        ? config.headers.Authorization.slice(0, 18) + '...'
        : '(missing)',
      keyLength: key ? key.length : 0
    });
  }

  return config;
});

// Log response errors for production debugging
openrouter.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.VERCEL) {
      console.error('[OpenRouter] Response error:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        code: error?.code
      });
    }
    return Promise.reject(error);
  }
);

module.exports = openrouter;
