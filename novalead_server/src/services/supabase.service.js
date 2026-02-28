const { supabase } = require('../config/db');
const prisma = require('./prisma.service');
const { AppError } = require('../utils/apiError');
const { getEnv } = require('../config/env');

const env = getEnv();

/**
 * User Operations
 */

async function createUser(email, passwordHash) {
  let authUserId;
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: Math.random().toString(36), // Dummy password for Supabase Auth, we store hash in users table
    email_confirm: true
  });

  if (authError) {
    throw new AppError(`Supabase Auth failed: ${authError.message}`, 400);
  }

  authUserId = authData.user.id;

  try {
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { id: authUserId },
        update: {
          email,
          password_hash: passwordHash
        },
        create: {
          id: authUserId,
          email,
          password_hash: passwordHash,
          credits: env.INITIAL_CREDITS
        }
      });

      await tx.credit.upsert({
        where: { user_id: authUserId },
        update: {},
        create: {
          user_id: authUserId,
          balance: env.INITIAL_CREDITS
        }
      });

      await tx.profile.upsert({
        where: { user_id: authUserId },
        update: {},
        create: {
          user_id: authUserId
        }
      });

      return user;
    });

    return {
      ...newUser,
      credits: env.INITIAL_CREDITS
    };
  } catch (error) {
    console.error('[DB] Prisma user creation failed:', error.message);
    await supabase.auth.admin.deleteUser(authUserId);
    throw new AppError(`Failed to create user profile: ${error.message}`, 500);
  }
}

async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { Credit: true }
    });

    if (!user) return null;

    return {
      ...user,
      credits: user.Credit?.balance ?? user.credits ?? env.INITIAL_CREDITS
    };
  } catch (error) {
    console.error('[DB] findUserByEmail error:', error.message);
    return null;
  }
}

async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { Credit: true }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      ...user,
      credits: user.Credit?.balance ?? user.credits ?? env.INITIAL_CREDITS
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('[DB] getUserById error:', error.message);
    throw new AppError('Failed to fetch user', 500);
  }
}

/**
 * Search & Lead Operations
 */

async function saveSearch(userId, prompt, filters, totalResults, metadata = {}) {
  try {
    const search = await prisma.search.create({
      data: {
        user_id: userId,
        prompt: prompt,
        filters: filters || {},
        total_results: totalResults || 0,
        credits_charged: metadata.credits_charged || 0,
        cache_hit: metadata.cache_hit || false,
        cache_strategy: metadata.cache_strategy || 'miss',
        cache_id: metadata.cache_id || null,
        canonical_filters: metadata.canonical_filters || {},
        lead_snapshot: metadata.leads || []
      }
    });

    return search;
  } catch (error) {
    console.error('[DB] saveSearch error:', error.message);
    throw new AppError(`Failed to save search: ${error.message}`, 500);
  }
}

async function saveLeads(userId, searchId, normalizedLeads, rawLeads) {
  const safeNormalized = Array.isArray(normalizedLeads) ? normalizedLeads : [];
  const safeRaw = Array.isArray(rawLeads) ? rawLeads : [];

  const records = safeNormalized.map((lead, index) => {
    const raw = safeRaw[index] || null;

    return {
      user_id: userId,
      search_id: searchId,
      name: lead.name ?? null,
      title: lead.title ?? null,
      linkedin_url: lead.linkedin_url ?? null,
      company_name: lead.company?.name ?? null,
      company_linkedin_url: lead.company?.linkedin_url ?? null,
      company_website: lead.company?.website ?? null,
      raw_data: raw,
      userid: userId // Legacy naming compatibility
    };
  });

  if (!records.length) return [];

  try {
    await prisma.lead.createMany({
      data: records
    });
    return records;
  } catch (error) {
    console.error('[DB] saveLeads error:', error.message);
    return [];
  }
}

async function listSearches(userId, page = 1, limit = 10) {
  const p = Math.max(1, parseInt(page));
  const l = Math.max(1, parseInt(limit));
  const skip = (p - 1) * l;

  try {
    const [searches, count] = await Promise.all([
      prisma.search.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: l
      }),
      prisma.search.count({
        where: { user_id: userId }
      })
    ]);

    const mapped = searches.map((item) => ({
      ...item,
      result_count: item.total_results || 0,
      credits_used: item.credits_charged || 0
    }));

    return {
      items: mapped,
      total: count,
      page: p,
      limit: l
    };
  } catch (error) {
    console.error('[DB] listSearches error:', error.message);
    return { items: [], total: 0, page: p, limit: l };
  }
}

async function getSearchWithLeads(userId, searchId) {
  try {
    const search = await prisma.search.findUnique({
      where: { id: searchId },
      include: {
        Leads: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!search || search.user_id !== userId) {
      throw new AppError('Search not found', 404);
    }

    let leads = search.Leads || [];

    if (leads.length === 0 && Array.isArray(search.lead_snapshot)) {
      leads = search.lead_snapshot.map((s) => ({
        name: s.name,
        title: s.title,
        linkedin_url: s.linkedin_url,
        company_name: s.company?.name || s.company_name,
        company_linkedin_url: s.company?.linkedin_url || s.company_linkedin_url,
        company_website: s.company?.website || s.company_website
      }));
    }

    return { ...search, leads };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('[DB] getSearchWithLeads error:', error.message);
    throw new AppError('Failed to fetch search details', 500);
  }
}

async function deleteSearch(userId, searchId) {
  try {
    await prisma.search.delete({
      where: { id: searchId, user_id: userId }
    });
  } catch (error) {
    console.error('[DB] deleteSearch error:', error.message);
    throw new AppError('Failed to delete search', 500);
  }
}

/**
 * Credit Operations
 */

async function getCreditBalance(userId) {
  try {
    const credit = await prisma.credit.findUnique({
      where: { user_id: userId }
    });
    return credit?.balance ?? env.INITIAL_CREDITS;
  } catch (error) {
    console.error('[DB] getCreditBalance error:', error.message);
    return env.INITIAL_CREDITS;
  }
}

async function updateUserCredits(userId, amount) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Update credits table
      const updatedCredit = await tx.credit.update({
        where: { user_id: userId },
        data: { balance: { increment: amount } }
      });

      // Sync to users table for legacy compatibility
      await tx.user.update({
        where: { id: userId },
        data: { credits: updatedCredit.balance }
      });

      return updatedCredit.balance;
    });
  } catch (error) {
    console.error('[DB] updateUserCredits error:', error.message);
    throw new AppError('Failed to update credits', 500);
  }
}

/**
 * Global Cache Operations
 */

async function getReadyGlobalCacheByHash(filterHash) {
  try {
    const cache = await prisma.globalSearchCache.findUnique({
      where: {
        filter_hash: filterHash,
        status: 'ready',
        expires_at: { gt: new Date() }
      }
    });
    return cache;
  } catch (error) {
    console.error('[DB] getReadyGlobalCacheByHash error:', error.message);
    return null;
  }
}

async function getAnyGlobalCacheByHash(filterHash) {
  try {
    return await prisma.globalSearchCache.findUnique({
      where: { filter_hash: filterHash }
    });
  } catch (error) {
    console.error('[DB] getAnyGlobalCacheByHash error:', error.message);
    return null;
  }
}

async function createOrGetPendingGlobalCache(filterHash, canonicalFilters, expiresAt, provider = 'explorium') {
  try {
    return await prisma.globalSearchCache.upsert({
      where: { filter_hash: filterHash },
      update: {},
      create: {
        filter_hash: filterHash,
        canonical_filters: canonicalFilters,
        status: 'pending',
        provider,
        expires_at: expiresAt,
        hit_count: 0
      }
    });
  } catch (error) {
    console.error('[DB] createOrGetPendingGlobalCache error:', error.message);
    return null;
  }
}

async function markGlobalCacheReady(cacheId, totalResults, expiresAt) {
  try {
    return await prisma.globalSearchCache.update({
      where: { id: cacheId },
      data: {
        status: 'ready',
        total_results: totalResults || 0,
        expires_at: expiresAt,
        error_message: null
      }
    });
  } catch (error) {
    console.error('[DB] markGlobalCacheReady error:', error.message);
    return null;
  }
}

async function markGlobalCacheFailed(cacheId, errorMessage) {
  try {
    await prisma.globalSearchCache.update({
      where: { id: cacheId },
      data: {
        status: 'failed',
        error_message: String(errorMessage || 'Unknown error').slice(0, 500)
      }
    });
  } catch (error) {
    console.error('[DB] markGlobalCacheFailed error:', error.message);
  }
}

async function touchGlobalCacheHit(cacheId) {
  try {
    await prisma.globalSearchCache.update({
      where: { id: cacheId },
      data: {
        hit_count: { increment: 1 },
        last_hit_at: new Date()
      }
    });
  } catch (error) {
    console.error('[DB] touchGlobalCacheHit error:', error.message);
  }
}

async function saveGlobalCachedLeads(cacheId, leads) {
  if (!Array.isArray(leads) || leads.length === 0) return;

  const records = leads.map(l => ({
    cache_id: cacheId,
    name: l.name || null,
    title: l.title || null,
    linkedin_url: l.linkedin_url || null,
    company_name: l.company?.name || l.company_name || null,
    company_linkedin_url: l.company?.linkedin_url || l.company_linkedin_url || null,
    company_website: l.company?.website || l.company_website || null,
    raw_data: l
  }));

  try {
    await prisma.globalCachedLead.createMany({
      data: records
    });
  } catch (error) {
    console.error('[DB] saveGlobalCachedLeads error:', error.message);
  }
}

async function listGlobalCachedLeads(cacheId) {
  try {
    return await prisma.globalCachedLead.findMany({
      where: { cache_id: cacheId },
      orderBy: { created_at: 'desc' }
    });
  } catch (error) {
    console.error('[DB] listGlobalCachedLeads error:', error.message);
    return [];
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  saveSearch,
  saveLeads,
  listSearches,
  getSearchWithLeads,
  deleteSearch,
  getCreditBalance,
  updateUserCredits,
  getReadyGlobalCacheByHash,
  getAnyGlobalCacheByHash,
  createOrGetPendingGlobalCache,
  markGlobalCacheReady,
  markGlobalCacheFailed,
  touchGlobalCacheHit,
  saveGlobalCachedLeads,
  listGlobalCachedLeads
};
