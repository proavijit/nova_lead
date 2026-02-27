const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getEnv } = require('../config/env');
const { createUser, findUserByEmail, authenticateWithSupabase } = require('../services/supabase.service');
const { AppError } = require('../utils/apiError');

const env = getEnv();

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError('Email and password are required', 400);
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await createUser(email, passwordHash, password);

        const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN
        });

        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError('Email and password are required', 400);
        }

        let user = await findUserByEmail(email);

        if (user?.password_hash) {
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                throw new AppError('Invalid credentials', 401);
            }
        } else {
            user = await authenticateWithSupabase(email, password);
            if (!user) {
                throw new AppError('Invalid credentials', 401);
            }
        }

        const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN
        });

        if (user.password_hash) {
            delete user.password_hash;
        }

        res.json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user
            }
        });
    } catch (err) {
        next(err);
    }
};
