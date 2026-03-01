const { parseNLToFilters } = require('../services/ai.service');
const { searchProspects } = require('../services/explorium.service');
const { normalizeAll } = require('../services/normalizer.service');
const {
  saveSearch,
  saveLeads,
  getCreditBalance,
  getReadyGlobalCacheByHash,
  createOrGetPendingGlobalCache,
  markGlobalCacheReady,
  markGlobalCacheFailed,
  touchGlobalCacheHit,
  saveGlobalCachedLeads,
  getGlobalCachedLeads,
  cloneCacheLeadsToUserSearch,
  waitForReadyGlobalCache
} = require('../services/supabase.service');
const { validateFilter } = require('../validators/filterSchema');
const { AppError } = require('../utils/apiError');
const { checkCredits, deductCredits } = require('../services/credit.service');
const { CREDIT_COST_PER_SEARCH } = require('../utils/constants');
const { buildCanonicalFilters, computeFilterHash, getCacheExpiryDate } = require('../services/cache.service');

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

const ENABLE_DEBUG_LOGGING = true;

function debugLog(...args) {
  if (ENABLE_DEBUG_LOGGING) {
    console.log('[CACHE DEBUG]', new Date().toISOString(), ...args);
  }
}

function cachedLeadToResponse(lead) {
  return {
    name: lead.name ?? null,
    title: lead.title ?? null,
    linkedin_url: lead.linkedin_url ?? null,
    company: {
      name: lead.company_name ?? null,
      linkedin_url: lead.company_linkedin_url ?? null,
      website: lead.company_website ?? null
    }
  };
}

async function respondWithCacheHit({
  res,
  userId,
  prompt,
  parsedFilters,
  page,
  cacheRow,
  canonicalFilters,
  filterHash
}) {
  const cachedLeads = await getGlobalCachedLeads(cacheRow.id);
  const leads = cachedLeads.map((lead) => cachedLeadToResponse(lead));

  const search = await saveSearch(userId, prompt, parsedFilters, cacheRow.total_results || leads.length, {
    cache_id: cacheRow.id,
    filter_hash: filterHash,
    cache_hit: true,
    cache_strategy: 'hash',
    credits_charged: 0,
    canonical_filters: canonicalFilters,
    leads
  });

  await cloneCacheLeadsToUserSearch(userId, search.id, cachedLeads);
  await touchGlobalCacheHit(cacheRow.id);

  const creditsRemaining = await getCreditBalance(userId);

  return res.json({
    success: true,
    data: {
      search_id: search.id,
      cache_id: cacheRow.id,
      cache_hit: true,
      cache_strategy: 'hash',
      credits_charged: 0,
      credits_remaining: creditsRemaining,
      total_results: cacheRow.total_results || leads.length,
      page,
      leads
    }
  });
}

exports.search = async (req, res, next) => {
  let pendingCacheId = null;

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

    const canonicalFilters = buildCanonicalFilters(parsed);
    const { filterHash } = computeFilterHash(canonicalFilters);
    const expiresAt = getCacheExpiryDate();

    debugLog('Cache lookup:', { prompt, filterHash: filterHash.slice(0, 12), canonicalFilters });

    const readyCache = await getReadyGlobalCacheByHash(filterHash);
    if (readyCache) {
      debugLog('Cache HIT!', { cacheId: readyCache.id, totalResults: readyCache.total_results, filterHash: filterHash.slice(0, 12) });
      return respondWithCacheHit({
        res,
        userId,
        prompt,
        parsedFilters: parsed,
        page,
        cacheRow: readyCache,
        canonicalFilters,
        filterHash
      });
    }

    debugLog('Cache MISS, creating new cache entry');

    const pendingOrExisting = await createOrGetPendingGlobalCache(filterHash, canonicalFilters, expiresAt);
    pendingCacheId = pendingOrExisting?.id || null;

    if (pendingOrExisting?.status === 'ready') {
      debugLog('Pending cache became ready:', { cacheId: pendingOrExisting.id });
      return respondWithCacheHit({
        res,
        userId,
        prompt,
        parsedFilters: parsed,
        page,
        cacheRow: pendingOrExisting,
        canonicalFilters,
        filterHash
      });
    }

    if (pendingOrExisting?.status === 'pending') {
      debugLog('Waiting for pending cache:', { cacheId: pendingOrExisting.id });
      const eventuallyReady = await waitForReadyGlobalCache(filterHash, 2, 350);
      if (eventuallyReady) {
        debugLog('Pending cache ready after wait:', { cacheId: eventuallyReady.id });
        return respondWithCacheHit({
          res,
          userId,
          prompt,
          parsedFilters: parsed,
          page,
          cacheRow: eventuallyReady,
          canonicalFilters,
          filterHash
        });
      }
    }

    await checkCredits(userId, CREDIT_COST_PER_SEARCH);

    const exploResult = await searchProspects(parsed);
    const leads = normalizeAll(exploResult.data || []);

    if (pendingCacheId) {
      try {
        await saveGlobalCachedLeads(pendingCacheId, leads, exploResult.data || []);
        await markGlobalCacheReady(pendingCacheId, exploResult.total_results || leads.length, expiresAt);
        debugLog('Saved to global cache:', { cacheId: pendingCacheId, totalResults: exploResult.total_results, filterHash: filterHash.slice(0, 12), expiresAt });
      } catch (cacheErr) {
        debugLog('Cache save error (non-fatal):', cacheErr.message);
      }
    }

    const search = await saveSearch(userId, prompt, parsed, exploResult.total_results || 0, {
      cache_id: pendingCacheId,
      filter_hash: filterHash,
      cache_hit: false,
      cache_strategy: 'miss',
      credits_charged: CREDIT_COST_PER_SEARCH,
      canonical_filters: canonicalFilters,
      leads
    });
    await saveLeads(userId, search.id, leads, exploResult.data);

    let creditsRemaining;
    try {
      creditsRemaining = await deductCredits(userId, CREDIT_COST_PER_SEARCH, search.id);
    } catch (deductErr) {
      throw deductErr;
    }

    return res.json({
      success: true,
      data: {
        search_id: search.id,
        cache_id: pendingCacheId,
        cache_hit: false,
        cache_strategy: 'miss',
        credits_charged: CREDIT_COST_PER_SEARCH,
        credits_remaining: creditsRemaining,
        total_results: exploResult.total_results,
        page,
        leads
      }
    });
  } catch (err) {
    if (pendingCacheId) {
      try {
        await markGlobalCacheFailed(pendingCacheId, err.message);
      } catch (markErr) {
        // Error reporting should not hide the original failure.
      }
    }
    next(err);
  }
};
