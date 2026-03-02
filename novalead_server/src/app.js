const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { globalLimiter } = require('./middleware/rateLimit.middleware');
const { getEnv } = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
const apiRouter = require('./routes');

const app = express();

/**
 * =========================================
 * CORS (MUST BE FIRST - VERCEL SAFE)
 * =========================================
 */

app.use(cors({
  origin: 'https://novaleadclient.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://novaleadclient.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept');
  res.sendStatus(200);
});

/**
 * =========================================
 * SECURITY
 * =========================================
 */

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

/**
 * =========================================
 * MIDDLEWARE
 * =========================================
 */

app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));
app.use(globalLimiter);

/**
 * =========================================
 * ROUTES
 * =========================================
 */

app.use('/api/v1', apiRouter);

/**
 * =========================================
 * HEALTH CHECK
 * =========================================
 */

app.get('/api/v1/health', (req, res) => {
  const e = getEnv();

  const mask = (key) =>
    key ? `${key.slice(0, 8)}...${key.slice(-4)} (len=${key.length})` : '(missing)';

  res.json({
    status: 'ok',
    env: {
      NODE_ENV: e.NODE_ENV,
      VERCEL: process.env.VERCEL || '(not set)',
      OPENROUTER_API_KEY: mask(e.OPENROUTER_API_KEY),
      OPENROUTER_MODEL: e.OPENROUTER_MODEL,
      SUPABASE_URL: e.SUPABASE_URL ? 'set' : '(missing)'
    }
  });
});

/**
 * =========================================
 * ERROR HANDLER
 * =========================================
 */

app.use(errorHandler);

module.exports = app;