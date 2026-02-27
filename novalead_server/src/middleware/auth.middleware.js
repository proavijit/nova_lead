const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');
const { AppError } = require('../utils/apiError');
const { supabase } = require('../config/db');

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

    const { data, error } = await supabase
      .from('users')
      .select('id, email, credits')
      .eq('id', decoded.id)
      .single();

    if (error || !data) {
      const isUsersTableMissing =
        typeof error?.message === 'string' &&
        (error.message.includes("Could not find the table 'public.users' in the schema cache") ||
          error.message.toLowerCase().includes('public.users'));

      if (!isUsersTableMissing) {
        return next(new AppError('User not found', 401));
      }

      const { data: authUserData, error: authUserError } = await supabase.auth.admin.getUserById(decoded.id);
      if (authUserError || !authUserData?.user?.id) {
        return next(new AppError('User not found', 401));
      }

      req.user = {
        id: authUserData.user.id,
        email: authUserData.user.email,
        credits: env.INITIAL_CREDITS
      };
      return next();
    }

    req.user = {
      id: data.id,
      email: data.email,
      credits: data.credits
    };

    next();
  } catch (err) {
    next(err);
  }
};
