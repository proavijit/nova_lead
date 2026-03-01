const Joi = require('joi');
const path = require('path');

// Load .env first (local development)
// dotenv may be a devDependency; guard against MODULE_NOT_FOUND in production
try {
  require('dotenv').config();
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.production'),
    override: false
  });
} catch (_e) {
  // In production (Vercel), env vars are injected by the platform; dotenv is optional.
}

let cachedEnv;

const envSchema = Joi.object({
  PORT: Joi.number().integer().min(1).max(65535).default(5000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  OPENROUTER_API_KEY: Joi.string().required(),
  OPENROUTER_MODEL: Joi.string().default('openai/gpt-4o'),
  OPENROUTER_TIMEOUT_MS: Joi.number().integer().min(1000).default(15000),

  EXPLORIUM_API_KEY: Joi.string().required(),
  EXPLORIUM_BASE_URL: Joi.string().uri().required(),
  EXPLORIUM_TIMEOUT_MS: Joi.number().integer().min(1000).default(20000),
  CORS_ORIGIN: Joi.string().allow('').default(
    'http://localhost:3000,http://localhost:3001,https://novaleadclient.vercel.app'
  ),

  CREDIT_COST_PER_SEARCH: Joi.number().integer().min(1).default(1),
  INITIAL_CREDITS: Joi.number().integer().min(0).default(10)
}).unknown(true);

function getEnv() {
  if (cachedEnv) return cachedEnv;
  const clean = (value) => {
    if (typeof value !== 'string') return value;
    // Strip surrounding quotes (single or double) that users may accidentally
    // paste into Vercel dashboard when copying from .env files
    let v = value.trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    // Remove actual newlines/carriage-returns (not escaped literal strings)
    return v.replace(/\r\n|\r|\n/g, '').trim();
  };

  const {
    PORT,
    NODE_ENV,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    OPENROUTER_TIMEOUT_MS,
    EXPLORIUM_API_KEY,
    EXPLORIUM_BASE_URL,
    EXPLORIUM_TIMEOUT_MS,
    CORS_ORIGIN,
    CREDIT_COST_PER_SEARCH,
    INITIAL_CREDITS
  } = process.env;

  const { value, error } = envSchema.validate(
    {
      PORT: clean(PORT),
      NODE_ENV: clean(NODE_ENV),
      SUPABASE_URL: clean(SUPABASE_URL),
      SUPABASE_SERVICE_ROLE_KEY: clean(SUPABASE_SERVICE_ROLE_KEY),
      JWT_SECRET: clean(JWT_SECRET),
      JWT_EXPIRES_IN: clean(JWT_EXPIRES_IN),
      OPENROUTER_API_KEY: clean(OPENROUTER_API_KEY),
      OPENROUTER_MODEL: clean(OPENROUTER_MODEL),
      OPENROUTER_TIMEOUT_MS: clean(OPENROUTER_TIMEOUT_MS),
      EXPLORIUM_API_KEY: clean(EXPLORIUM_API_KEY),
      EXPLORIUM_BASE_URL: clean(EXPLORIUM_BASE_URL),
      EXPLORIUM_TIMEOUT_MS: clean(EXPLORIUM_TIMEOUT_MS),
      CORS_ORIGIN: clean(CORS_ORIGIN),
      CREDIT_COST_PER_SEARCH: clean(CREDIT_COST_PER_SEARCH),
      INITIAL_CREDITS: clean(INITIAL_CREDITS)
    },
    {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    }
  );

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  if (
    typeof value.SUPABASE_SERVICE_ROLE_KEY === 'string' &&
    (value.SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_publishable_') ||
      value.SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_anon_') ||
      value.SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_publishable'))
  ) {
    console.warn(
      '[Config warning] SUPABASE_SERVICE_ROLE_KEY looks like a publishable/anon key. Server can start, but auth.admin endpoints (register via auth.users) will fail until you set the real service_role key.'
    );
  }

  // Log env key availability in production to help diagnose deployment issues
  if (value.NODE_ENV === 'production' || process.env.VERCEL) {
    const mask = (key) => (key ? `${key.slice(0, 10)}...${key.slice(-4)}` : '(missing)');
    const charCheck = (key) => {
      if (!key) return '(missing)';
      const hasQuotes = key.includes('"') || key.includes("'");
      const hasNewlines = /[\r\n]/.test(key);
      const hasSpaces = key !== key.trim();
      return `len=${key.length} quotes=${hasQuotes} newlines=${hasNewlines} spaces=${hasSpaces} prefix=${key.slice(0, 8)}`;
    };
    console.log('[Env] OPENROUTER_API_KEY:', mask(value.OPENROUTER_API_KEY));
    console.log('[Env] OPENROUTER_API_KEY diagnostics:', charCheck(value.OPENROUTER_API_KEY));
    console.log('[Env] OPENROUTER_API_KEY raw diagnostics:', charCheck(process.env.OPENROUTER_API_KEY));
    console.log('[Env] EXPLORIUM_API_KEY:', mask(value.EXPLORIUM_API_KEY));
    console.log('[Env] SUPABASE_URL:', value.SUPABASE_URL ? 'set' : '(missing)');
    console.log('[Env] NODE_ENV:', value.NODE_ENV);
    console.log('[Env] VERCEL:', process.env.VERCEL || '(not set)');
  }

  cachedEnv = value;
  return cachedEnv;
}

module.exports = { getEnv };
