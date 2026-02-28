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

    let { data, error } = await supabase
      .from('users')
      .select('id, email, credits')
      .eq('id', decoded.id)
      .single();

    console.log('[AUTH DEBUG] Looking for user:', decoded.id, 'Result:', { error, hasData: !!data });

    if (
      error &&
      typeof error?.message === 'string' &&
      error.message.toLowerCase().includes('column users.credits does not exist')
    ) {
      ({ data, error } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', decoded.id)
        .single());
      if (data && !error) {
        data = { ...data, credits: env.INITIAL_CREDITS };
      }
    }

    if (error || !data) {
      console.log('[AUTH DEBUG] User lookup error:', error?.message);
      const isUsersTableMissing =
        typeof error?.message === 'string' &&
        (error.message.includes("Could not find the table 'public.users' in the schema cache") ||
          error.message.toLowerCase().includes('public.users'));

      if (!isUsersTableMissing) {
        console.log('[AUTH DEBUG] User not found in users table, checking auth...');
        const { data: authUserData, error: authUserError } = await supabase.auth.admin.getUserById(decoded.id);
        if (authUserError || !authUserData?.user?.id) {
          console.log('[AUTH DEBUG] User not found in auth either:', authUserError?.message);
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
