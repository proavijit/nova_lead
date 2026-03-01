const { supabase } = require('../config/db');
const prisma = require('./prisma.service');
const { AppError } = require('../utils/apiError');
const { getEnv } = require('../config/env');

const env = getEnv();

async function createUser(email, passwordHash, plainPassword) {
  let authUserId = null;

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: plainPassword,
    email_confirm: true
  });

  if (authError || !authData?.user?.id) {
    const message = authError?.message || 'Failed to create auth user';
    if (message.includes('valid Bearer token')) {
      throw new AppError(
        'Registration failed: Supabase service_role key is invalid/missing on server. Update SUPABASE_SERVICE_ROLE_KEY in novalead_server/.env',
        500
      );
    }
    if (message.toLowerCase().includes('already')) {
      throw new AppError('User already exists', 400);
    }
    throw new AppError(`Registration failed: ${message}`, 500);
  }

  authUserId = authData.user.id;

  try {
    const user = await prisma.user.upsert({
      where: { id: authUserId },
      update: {
        email,
        password_hash: passwordHash,
        credits: env.INITIAL_CREDITS
      },
      create: {
        id: authUserId,
        email,
        password_hash: passwordHash,
        credits: env.INITIAL_CREDITS
      }
    });
    return user;
  } catch (error) {
    await supabase.auth.admin.deleteUser(authUserId);
    throw new AppError(`Failed to create user profile: ${error.message}`, 500);
  }
}

async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password_hash: true,
        credits: true
      }
    });
    return user;
  } catch (error) {
    return null;
  }
}

async function authenticateWithSupabase(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data?.user?.id) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email || email,
    credits: env.INITIAL_CREDITS
  };
}

async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        credits: true,
        created_at: true
      }
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  } catch (error) {
    throw new AppError('User not found', 404);
  }
}

async function saveSearch(userId, prompt, filters, totalResults, metadata = {}) {
  try {
    const search = await prisma.search.create({
      data: {
        user_id: userId,
        prompt: prompt || null,
        filters: filters || null,
        total_results: totalResults || 0,
        cache_id: metadata.cache_id || null,
        filter_hash: metadata.filter_hash || null,
        cache_hit: Boolean(metadata.cache_hit),
        cache_strategy: metadata.cache_strategy || null,
        credits_charged: Number.isInteger(metadata.credits_charged) ? metadata.credits_charged : 0,
        canonical_filters: metadata.canonical_filters || null,
        lead_snapshot: metadata.leads ? metadata.leads : null
      }
    });
    return search;
  } catch (error) {
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
      raw_data: raw
    };
  });

  if (!records.length) return [];

  try {
    await prisma.lead.createMany({
      data: records
    });

    const createdLeads = await prisma.lead.findMany({
      where: { search_id: searchId },
      orderBy: { created_at: 'asc' }
    });
    return createdLeads;
  } catch (error) {
    throw new AppError(`Failed to save leads: ${error.message}`, 500);
  }
}

async function listSearches(userId, page = 1, limit = 10) {
  const p = Number(page) || 1;
  const l = Number(limit) || 10;
  const skip = (p - 1) * l;

  try {
    const [items, total] = await prisma.$transaction([
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

    const mapped = items.map((item) => ({
      ...item,
      prompt: item.prompt ?? item.query ?? '',
      total_results: item.total_results ?? 0,
      credits_charged: item.credits_charged ?? 0,
      lead_snapshot: item.lead_snapshot || [],
      filter_hash: item.filter_hash ?? null
    }));

    return {
      items: mapped,
      total,
      page: p,
      limit: l
    };
  } catch (error) {
    throw new AppError(`Failed to list searches: ${error.message}`, 500);
  }
}

async function getSearchWithLeads(userId, searchId) {
  try {
    const search = await prisma.search.findUnique({
      where: { id: searchId }
    });

    if (!search || search.user_id !== userId) {
      throw new AppError('Search not found', 404);
    }

    const leads = await prisma.lead.findMany({
      where: { search_id: searchId },
      orderBy: { created_at: 'desc' }
    });

    return {
      search: {
        ...search,
        prompt: search.prompt ?? search.query ?? '',
        total_results: search.total_results ?? 0,
        credits_charged: search.credits_charged ?? 0,
        lead_snapshot: search.lead_snapshot || []
      },
      leads: leads.length > 0 ? leads.map((lead) => ({
        ...lead,
        title: lead.title ?? null,
        linkedin_url: lead.linkedin_url ?? null,
        company_name: lead.company_name ?? null,
        company_linkedin_url: lead.company_linkedin_url ?? null,
        company_website: lead.company_website ?? null
      })) : (search.lead_snapshot || [])
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to fetch leads: ${error.message}`, 500);
  }
}

async function deleteSearch(userId, searchId) {
  try {
    await prisma.search.deleteMany({
      where: {
        id: searchId,
        user_id: userId
      }
    });
  } catch (error) {
    throw new AppError(`Failed to delete search: ${error.message}`, 500);
  }
}

async function getCreditBalance(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (user && user.credits !== null) {
      return user.credits;
    }

    const creditRec = await prisma.credit.findUnique({
      where: { user_id: userId }
    });

    if (creditRec && creditRec.balance !== null) {
      return creditRec.balance;
    }

    return env.INITIAL_CREDITS;
  } catch (error) {
    return env.INITIAL_CREDITS;
  }
}

async function getReadyGlobalCacheByHash(filterHash) {
  try {
    const cache = await prisma.globalSearchCache.findFirst({
      where: {
        filter_hash: filterHash,
        status: 'ready',
        expires_at: {
          gt: new Date()
        }
      }
    });
    return cache;
  } catch (error) {
    throw new AppError(`Failed to read global cache: ${error.message}`, 500);
  }
}

async function getAnyGlobalCacheByHash(filterHash) {
  try {
    const cache = await prisma.globalSearchCache.findUnique({
      where: { filter_hash: filterHash }
    });
    return cache;
  } catch (error) {
    throw new AppError(`Failed to read global cache: ${error.message}`, 500);
  }
}

async function createOrGetPendingGlobalCache(filterHash, canonicalFilters, expiresAt, provider = 'explorium') {
  try {
    const cache = await prisma.globalSearchCache.upsert({
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
    return cache;
  } catch (error) {
    throw new AppError(`Failed to create global cache row: ${error.message}`, 500);
  }
}

async function markGlobalCacheReady(cacheId, totalResults, expiresAt) {
  try {
    const cache = await prisma.globalSearchCache.update({
      where: { id: cacheId },
      data: {
        status: 'ready',
        total_results: totalResults || 0,
        expires_at: expiresAt,
        error_message: null
      }
    });
    return cache;
  } catch (error) {
    throw new AppError(`Failed to mark cache ready: ${error.message}`, 500);
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
    throw new AppError(`Failed to mark cache failed: ${error.message}`, 500);
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
    // Silently ignore
  }
}

async function saveGlobalCachedLeads(cacheId, normalizedLeads, rawLeads) {
  const safeNormalized = Array.isArray(normalizedLeads) ? normalizedLeads : [];
  const safeRaw = Array.isArray(rawLeads) ? rawLeads : [];
  if (!safeNormalized.length) return [];

  const records = safeNormalized.map((lead, index) => ({
    cache_id: cacheId,
    lead_rank: index,
    name: lead.name ?? null,
    title: lead.title ?? null,
    linkedin_url: lead.linkedin_url ?? null,
    company_name: lead.company?.name ?? null,
    company_linkedin_url: lead.company?.linkedin_url ?? null,
    company_website: lead.company?.website ?? null,
    raw_data: safeRaw[index] || null
  }));

  try {
    await prisma.globalCachedLead.createMany({
      data: records
    });
    return records;
  } catch (error) {
    throw new AppError(`Failed to save global cached leads: ${error.message}`, 500);
  }
}

async function getGlobalCachedLeads(cacheId) {
  try {
    const leads = await prisma.globalCachedLead.findMany({
      where: { cache_id: cacheId },
      orderBy: { lead_rank: 'asc' }
    });
    return leads;
  } catch (error) {
    throw new AppError(`Failed to fetch global cached leads: ${error.message}`, 500);
  }
}

function cachedLeadToNormalized(lead) {
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

async function cloneCacheLeadsToUserSearch(userId, searchId, cachedLeads) {
  const leads = Array.isArray(cachedLeads) ? cachedLeads : [];
  if (!leads.length) return [];

  const normalizedLeads = leads.map((lead) => cachedLeadToNormalized(lead));
  const rawLeads = leads.map((lead) => lead.raw_data || null);

  return saveLeads(userId, searchId, normalizedLeads, rawLeads);
}

async function waitForReadyGlobalCache(filterHash, retries = 3, delayMs = 400) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const ready = await getReadyGlobalCacheByHash(filterHash);
    if (ready) return ready;
  }
  return null;
}

module.exports = {
  createUser,
  findUserByEmail,
  authenticateWithSupabase,
  getUserById,
  saveSearch,
  saveLeads,
  listSearches,
  getSearchWithLeads,
  deleteSearch,
  getCreditBalance,
  getReadyGlobalCacheByHash,
  getAnyGlobalCacheByHash,
  createOrGetPendingGlobalCache,
  markGlobalCacheReady,
  markGlobalCacheFailed,
  touchGlobalCacheHit,
  saveGlobalCachedLeads,
  getGlobalCachedLeads,
  cloneCacheLeadsToUserSearch,
  waitForReadyGlobalCache
};
