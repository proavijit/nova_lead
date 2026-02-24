const { checkCredits } = require('../services/credit.service');
const { CREDIT_COST_PER_SEARCH } = require('../utils/constants');

module.exports = async function creditMiddleware(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return next(new Error('User context missing in credit middleware'));
    }

    const credits = await checkCredits(userId, CREDIT_COST_PER_SEARCH);

    req.user.credits = credits;

    next();
  } catch (err) {
    next(err);
  }
};
