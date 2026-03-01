const Joi = require('joi');
const path = require('path');

// Load .env first (local development)
require('dotenv').config();

// Also load .env.production as fallback for Vercel deployments
// dotenv won't overwrite vars that are already set unless override is true,
// so Vercel dashboard env vars take priority, and .env.production fills gaps.
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.production'),
  override: false
});

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
    // Strip actual newlines (\r\n, \n, \r), surrounding whitespace, and stray quotes
    // The old regex /\\r\\n|\\n/ matched LITERAL text "\r\n" not actual newline chars
    return value.trim().replace(/\r?\n|\r/g, '').replace(/^["']+|["']+$/g, '');
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
    const mask = (key) => (key ? `${key.slice(0, 12)}... (len=${key.length})` : '(missing)');
    console.log('[Env] --- Production Environment Diagnostic ---');
    console.log('[Env] OPENROUTER_API_KEY:', mask(value.OPENROUTER_API_KEY));
    console.log('[Env] OPENROUTER_API_KEY (raw process.env):', mask(process.env.OPENROUTER_API_KEY));
    console.log('[Env] OPENROUTER_MODEL:', value.OPENROUTER_MODEL);
    console.log('[Env] EXPLORIUM_API_KEY:', mask(value.EXPLORIUM_API_KEY));
    console.log('[Env] SUPABASE_URL:', value.SUPABASE_URL ? 'set' : '(missing)');
    console.log('[Env] NODE_ENV:', value.NODE_ENV);
    console.log('[Env] VERCEL_ENV:', process.env.VERCEL_ENV || '(not set)');
    console.log('[Env] process.cwd():', process.cwd());
    console.log('[Env] --- End Diagnostic ---');
  }

  cachedEnv = value;
  return cachedEnv;
}

module.exports = { getEnv };
