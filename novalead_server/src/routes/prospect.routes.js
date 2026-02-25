const express = require('express');
const { search } = require('../controllers/prospect.controller');
const validate = require('../middleware/validate.middleware');
const { prospectSearchSchema } = require('../validators/prospect.validator');

const router = express.Router();

router.post('/search', validate(prospectSearchSchema), search);

module.exports = router;
