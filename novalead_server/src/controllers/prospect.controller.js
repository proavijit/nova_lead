const { parseNLToFilters } = require('../services/ai.service');
const { searchProspects } = require('../services/explorium.service');
const { normalizeAll } = require('../services/normalizer.service');
const { saveSearch, saveLeads, getCreditBalance } = require('../services/supabase.service');
const { validateFilter } = require('../validators/filterSchema');
const { AppError } = require('../utils/apiError');

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

async function safeSaveSearch(userId, prompt, filters, totalResults) {
    try {
        return await saveSearch(userId, prompt, filters, totalResults);
    } catch (err) {
        return { id: `temp-${Date.now()}`, user_id: userId, prompt, filters, total_results: totalResults, created_at: new Date().toISOString() };
    }
}

async function safeSaveLeads(userId, searchId, leads, rawLeads) {
    try {
        return await saveLeads(userId, searchId, leads, rawLeads);
    } catch (err) {
        return [];
    }
}

exports.search = async (req, res, next) => {
    try {
        const { prompt, page = 1 } = req.body;
        const userId = req.user?.id || DEFAULT_USER_ID;

        if (!prompt) {
            throw new AppError('Prompt is required', 400);
        }

        const parsed = await parseNLToFilters(prompt);

        const { error } = validateFilter(parsed);
        if (error) {
            throw new AppError(`AI produced invalid filters: ${error.message}`, 422);
        }

        parsed.page = page;
        parsed.page_size = parsed.page_size || parsed.size || 10;
        parsed.mode = parsed.mode || 'full';

        const exploResult = await searchProspects(parsed);

        const leads = normalizeAll(exploResult.data || []);

        const search = await safeSaveSearch(userId, prompt, parsed, exploResult.total_results || 0);
        await safeSaveLeads(userId, search.id, leads, exploResult.data);

        let creditsRemaining = 50;
        try {
            creditsRemaining = await getCreditBalance(userId);
        } catch (err) {
            creditsRemaining = 50;
        }

        res.json({
            success: true,
            data: {
                search_id: search.id,
                credits_remaining: creditsRemaining,
                total_results: exploResult.total_results,
                page,
                leads
            }
        });
    } catch (err) {
        next(err);
    }
};
