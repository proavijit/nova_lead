const Joi = require('joi');
require('dotenv').config({ override: true });

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
  const clean = (value) => (typeof value === 'string' ? value.trim() : value);

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

  cachedEnv = value;
  return cachedEnv;
}

module.exports = { getEnv };
