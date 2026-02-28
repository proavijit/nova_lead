const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');
const { AppError } = require('../utils/apiError');
const prisma = require('../services/prisma.service');

const env = getEnv();

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return next(new AppError('Authorization token missing', 401));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      return next(new AppError('Invalid or expired token', 401));
    }

    // Use Prisma for user lookup with credit inclusion
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { Credit: true }
    });

    if (!user) {
      console.log('[AUTH] User not found in database:', decoded.id);
      return next(new AppError('User session invalid', 401));
    }

    req.user = {
      id: user.id,
      email: user.email,
      credits: user.Credit?.balance ?? user.credits ?? env.INITIAL_CREDITS
    };

    next();
  } catch (err) {
    console.error('[AUTH] Middleware error:', err.message);
    next(err);
  }
};
