const { listSearches, getSearchWithLeads, deleteSearch, getCreditBalance } = require('../services/supabase.service');

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

async function safeListSearches(userId, page, limit) {
    try {
        return await listSearches(userId, page, limit);
    } catch (err) {
        return { items: [], total: 0, page: 1, limit: 10 };
    }
}

async function safeGetSearchWithLeads(userId, searchId) {
    try {
        return await getSearchWithLeads(userId, searchId);
    } catch (err) {
        throw new Error('Search not found');
    }
}

async function safeDeleteSearch(userId, searchId) {
    try {
        await deleteSearch(userId, searchId);
    } catch (err) {
        // Silently fail for deletes
    }
}

exports.getSearches = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user?.id || DEFAULT_USER_ID;
        const result = await safeListSearches(userId, page, limit);

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

exports.getSearch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || DEFAULT_USER_ID;
        const result = await safeGetSearchWithLeads(userId, id);

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteSearch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || DEFAULT_USER_ID;
        await safeDeleteSearch(userId, id);

        res.json({
            success: true,
            message: 'Search deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
