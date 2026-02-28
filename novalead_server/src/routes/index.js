const express = require('express');
const authRoutes = require('./auth.routes');
const prospectRoutes = require('./prospect.routes');
const searchRoutes = require('./search.routes');
const creditRoutes = require('./credit.routes');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/version', (req, res) => {
  res.json({
    version: '1.0.4-robust-schema-sync',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

router.use('/auth', authRoutes);
router.use('/prospects', authMiddleware, prospectRoutes);
router.use('/searches', authMiddleware, searchRoutes);
router.use('/credits', authMiddleware, creditRoutes);

module.exports = router;
