const express = require('express');
const authRoutes = require('./auth.routes');
const prospectRoutes = require('./prospect.routes');
const searchRoutes = require('./search.routes');
const creditRoutes = require('./credit.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/prospects', prospectRoutes);
router.use('/searches', searchRoutes);
router.use('/credits', creditRoutes);

module.exports = router;
