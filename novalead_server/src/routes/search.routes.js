const express = require('express');
const { getSearches, getSearch, deleteSearch } = require('../controllers/search.controller');

const router = express.Router();

router.get('/', getSearches);
router.get('/:id', getSearch);
router.delete('/:id', deleteSearch);

module.exports = router;
