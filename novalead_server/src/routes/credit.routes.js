const express = require('express');
const { getBalance, getHistory, addCredits } = require('../controllers/credit.controller');

const router = express.Router();

router.get('/balance', getBalance);
router.get('/history', getHistory);
router.post('/add', addCredits);

module.exports = router;
