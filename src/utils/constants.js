const { getEnv } = require('../config/env');

const env = getEnv();

const CREDIT_COST_PER_SEARCH = env.CREDIT_COST_PER_SEARCH;

module.exports = {
  CREDIT_COST_PER_SEARCH
};
