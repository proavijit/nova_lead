const Joi = require('joi');
require('dotenv').config();

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

  EXPLORIUM_API_KEY: Joi.string().required(),
  EXPLORIUM_BASE_URL: Joi.string().uri().required(),

  CREDIT_COST_PER_SEARCH: Joi.number().integer().min(1).default(1)
}).unknown(true);

function getEnv() {
  if (cachedEnv) return cachedEnv;

  const {
    PORT,
    NODE_ENV,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    EXPLORIUM_API_KEY,
    EXPLORIUM_BASE_URL,
    CREDIT_COST_PER_SEARCH
  } = process.env;

  const { value, error } = envSchema.validate(
    {
      PORT,
      NODE_ENV,
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      JWT_SECRET,
      JWT_EXPIRES_IN,
      OPENROUTER_API_KEY,
      OPENROUTER_MODEL,
      EXPLORIUM_API_KEY,
      EXPLORIUM_BASE_URL,
      CREDIT_COST_PER_SEARCH
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

  cachedEnv = value;
  return cachedEnv;
}

module.exports = { getEnv };
