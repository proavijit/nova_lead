const axios = require('axios');
const { getEnv } = require('./env');

const env = getEnv();

const openrouter = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-app.com',
    'X-Title': 'Lead Prospecting SaaS'
  }
});

module.exports = openrouter;
