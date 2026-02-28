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
const env = getEnv();
const corsOriginList = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedLocals = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'];

      if (
        corsOriginList.includes(origin) ||
        allowedLocals.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

app.use(globalLimiter);

app.use('/api/v1', apiRouter);

app.use(errorHandler);

module.exports = app;
