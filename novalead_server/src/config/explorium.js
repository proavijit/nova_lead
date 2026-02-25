const axios = require('axios');
const { getEnv } = require('./env');

const env = getEnv();

const explorium = axios.create({
  baseURL: env.EXPLORIUM_BASE_URL,
  timeout: env.EXPLORIUM_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    api_key: env.EXPLORIUM_API_KEY
  }
});

module.exports = explorium;
