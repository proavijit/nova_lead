const { listSearches, getSearchWithLeads, deleteSearch } = require('../services/supabase.service');

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

exports.getSearches = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user?.id || DEFAULT_USER_ID;
        const result = await listSearches(userId, page, limit);

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
        const result = await getSearchWithLeads(userId, id);

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
        await deleteSearch(userId, id);

        res.json({
            success: true,
            message: 'Search deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
