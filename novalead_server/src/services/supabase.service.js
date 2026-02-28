const { supabase } = require('../config/db');
const { AppError } = require('../utils/apiError');
const { getEnv } = require('../config/env');

const env = getEnv();
const USERS_TABLE_CACHE_ERROR = "Could not find the table 'public.users' in the schema cache";

function isUsersTableCacheError(error) {
  return (
    !!error &&
    typeof error.message === 'string' &&
    (error.message.includes(USERS_TABLE_CACHE_ERROR) || error.message.toLowerCase().includes('public.users'))
  );
}

function isMissingTableError(error, tableName) {
  if (!error || typeof error.message !== 'string') return false;
  return (
    error.code === 'PGRST205' ||
    error.message.toLowerCase().includes(`'public.${tableName.toLowerCase()}'`) ||
    error.message.toLowerCase().includes(`relation "${tableName.toLowerCase()}" does not exist`)
  );
}

function buildMissingTableMessage(tableName) {
  return `Database table '${tableName}' is unavailable in PostgREST schema cache. Run DB setup/migrations and reload Supabase schema cache.`;
}

function isMissingColumnError(error, columnName) {
  if (!error || typeof error.message !== 'string') return false;
  return (
    error.code === '42703' ||
    error.message.toLowerCase().includes(`column "${columnName.toLowerCase()}"`) ||
    error.message.toLowerCase().includes(`could not find the '${columnName.toLowerCase()}' column`)
  );
}

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

  // 1. Create entry in users table
  const userPayload = {
    id: authUserId,
    email
  };

  // Only add password_hash if it exists in schema
  if (passwordHash) {
    userPayload.password_hash = passwordHash;
  }

  let { data: userData, error: userError } = await supabase
    .from('users')
    .upsert(userPayload, { onConflict: 'id' })
    .select('*')
    .single();

  if (userError) {
    // If it failed because of password_hash column, try without it
    if (isMissingColumnError(userError, 'password_hash')) {
      delete userPayload.password_hash;
      ({ data: userData, error: userError } = await supabase
        .from('users')
        .upsert(userPayload, { onConflict: 'id' })
        .select('*')
        .single());
    }
  }

  if (userError) {
    console.error('[DB] Primary user creation failed:', userError.message);
    await supabase.auth.admin.deleteUser(authUserId);
    throw new AppError(`Failed to create user profile: ${userError.message}`, 500);
  }

  // 2. Initialize credits in either users or credits table
  try {
    const { error: creditsError } = await supabase
      .from('credits')
      .upsert({ user_id: authUserId, balance: env.INITIAL_CREDITS }, { onConflict: 'user_id' });

    if (creditsError) {
      // If credits table doesn't exist, it might be in users table
      await supabase
        .from('users')
        .update({ credits: env.INITIAL_CREDITS })
        .eq('id', authUserId);
    }
  } catch (e) {
    console.warn('[DB] Credits initialization warning:', e.message);
  }

  // 3. Initialize profile if table exists
  try {
    await supabase
      .from('profiles')
      .upsert({ user_id: authUserId }, { onConflict: 'user_id' });
  } catch (e) {
    // Ignore if profiles table doesn't exist or has issues
  }

  return {
    ...userData,
    credits: env.INITIAL_CREDITS
  };
}

async function findUserByEmail(email) {
  // Try to find in users table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error && (isUsersTableCacheError(error) || isMissingTableError(error, 'users'))) {
    return null;
  }

  if (!data) return null;

  // Add credits from separate table if not in users
  if (!data.credits) {
    try {
      const { data: creditsData } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', data.id)
        .maybeSingle();

      if (creditsData) {
        data.credits = creditsData.balance;
      } else {
        data.credits = env.INITIAL_CREDITS;
      }
    } catch (e) {
      data.credits = env.INITIAL_CREDITS;
    }
  }

  return data;
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
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    if (isUsersTableCacheError(error) || isMissingTableError(error, 'users')) {
      throw new AppError('Database table unavailable', 500);
    }
    throw new AppError('User not found', 404);
  }

  // Add credits from separate table if not in users
  if (!data.credits) {
    try {
      const { data: creditsData } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', data.id)
        .maybeSingle();

      if (creditsData) {
        data.credits = creditsData.balance;
      } else {
        data.credits = env.INITIAL_CREDITS;
      }
    } catch (e) {
      data.credits = env.INITIAL_CREDITS;
    }
  }

  return data;
}

async function saveSearch(userId, prompt, filters, totalResults, metadata = {}) {
  const { leads = [], ...meta } = metadata;

  const leadSnapshot = leads.length > 0
    ? leads.map((lead) => ({
      name: lead.name ?? null,
      title: lead.title ?? null,
      linkedin_url: lead.linkedin_url ?? null,
      company: {
        name: lead.company?.name ?? null,
        linkedin_url: lead.company?.linkedin_url ?? null,
        website: lead.company?.website ?? null
      },
      raw_data: lead.raw_data ?? null
    }))
    : null;

  const basePayload = {
    user_id: userId,
    prompt,
    filters,
    total_results: totalResults
  };

  const extendedPayload = {
    ...basePayload,
    cache_id: meta.cache_id || null,
    cache_hit: Boolean(meta.cache_hit),
    cache_strategy: meta.cache_strategy || null,
    credits_charged: Number.isInteger(meta.credits_charged) ? meta.credits_charged : 0,
    canonical_filters: meta.canonical_filters || null,
    lead_snapshot: leadSnapshot
  };

  let query = supabase.from('searches').insert(extendedPayload).select('*').single();
  let { data, error } = await query;

  if (error) {
    const shouldFallback =
      isMissingColumnError(error, 'cache_id') ||
      isMissingColumnError(error, 'cache_hit') ||
      isMissingColumnError(error, 'cache_strategy') ||
      isMissingColumnError(error, 'credits_charged') ||
      isMissingColumnError(error, 'canonical_filters') ||
      isMissingColumnError(error, 'lead_snapshot');

    if (!shouldFallback) {
      if (isMissingTableError(error, 'searches')) {
        throw new AppError(buildMissingTableMessage('searches'), 500);
      }
      throw new AppError(`Failed to save search: ${error.message}`, 500);
    }

    query = supabase.from('searches').insert(basePayload).select('*').single();
    ({ data, error } = await query);

    if (error) {
      // Fallback: The user's table has 'query' instead of 'prompt'
      const legacyPayload = {
        user_id: userId,
        query: prompt
      };

      ({ data, error } = await supabase.from('searches').insert(legacyPayload).select('*').single());

      if (error) {
        if (isMissingTableError(error, 'searches')) {
          throw new AppError(buildMissingTableMessage('searches'), 500);
        }
        throw new AppError(`Failed to save search: ${error.message}`, 500);
      }
    }
  }

  return data;
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

  const { data, error } = await supabase.from('leads').insert(records).select('*');

  if (error) {
    const legacyLeadsSchema =
      isMissingColumnError(error, 'user_id') ||
      isMissingColumnError(error, 'title') ||
      isMissingColumnError(error, 'linkedin_url') ||
      isMissingColumnError(error, 'company_name') ||
      isMissingColumnError(error, 'company_linkedin_url') ||
      isMissingColumnError(error, 'company_website') ||
      isMissingColumnError(error, 'raw_data');

    if (legacyLeadsSchema) {
      const fallbackRecords = safeNormalized.map((lead) => ({
        search_id: searchId,
        name: lead.name ?? null,
        email: null,
        phone: null
      }));
      const legacyRes = await supabase.from('leads').insert(fallbackRecords).select('*');
      if (!legacyRes.error) return legacyRes.data || [];
      if (isMissingTableError(legacyRes.error, 'leads')) {
        throw new AppError(buildMissingTableMessage('leads'), 500);
      }
      throw new AppError(`Failed to save leads: ${legacyRes.error.message}`, 500);
    }
    if (isMissingTableError(error, 'leads')) {
      throw new AppError(buildMissingTableMessage('leads'), 500);
    }
    throw new AppError(`Failed to save leads: ${error.message}`, 500);
  }

  return data;
}

async function listSearches(userId, page = 1, limit = 10) {
  const p = Number(page) || 1;
  const l = Number(limit) || 10;
  const from = (p - 1) * l;
  const to = from + l - 1;

  const { data, error, count } = await supabase
    .from('searches')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    if (isMissingTableError(error, 'searches')) {
      throw new AppError(buildMissingTableMessage('searches'), 500);
    }
    throw new AppError(`Failed to list searches: ${error.message}`, 500);
  }

  const mapped = (data || []).map((item) => ({
    ...item,
    id: item.id,
    prompt: item.prompt || item.query || '',
    result_count: item.total_results || 0,
    credits_used: item.credits_charged || 0,
    created_at: item.created_at
  }));

  return {
    items: mapped,
    total: count || 0,
    page: p,
    limit: l
  };
}

async function getSearchWithLeads(userId, searchId) {
  const { data: search, error: searchError } = await supabase
    .from('searches')
    .select('*')
    .eq('id', searchId)
    .eq('user_id', userId)
    .single();

  if (searchError || !search) {
    if (isMissingTableError(searchError, 'searches')) {
      throw new AppError(buildMissingTableMessage('searches'), 500);
    }
    throw new AppError('Search not found', 404);
  }

  let { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .eq('search_id', searchId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (leadsError && isMissingColumnError(leadsError, 'user_id')) {
    ({ data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('search_id', searchId)
      .order('created_at', { ascending: false }));
  }

  const hasLeadsData = leads && leads.length > 0;

  if (!hasLeadsData && search.lead_snapshot && Array.isArray(search.lead_snapshot)) {
    leads = search.lead_snapshot.map((snapshotLead) => ({
      name: snapshotLead.name ?? null,
      title: snapshotLead.title ?? null,
      linkedin_url: snapshotLead.linkedin_url ?? null,
      company_name: snapshotLead.company?.name ?? null,
      company_linkedin_url: snapshotLead.company?.linkedin_url ?? null,
      company_website: snapshotLead.company?.website ?? null,
      raw_data: snapshotLead.raw_data ?? null
    }));
  } else if (leadsError) {
    if (isMissingTableError(leadsError, 'leads')) {
      if (search.lead_snapshot && Array.isArray(search.lead_snapshot)) {
        leads = search.lead_snapshot.map((snapshotLead) => ({
          name: snapshotLead.name ?? null,
          title: snapshotLead.title ?? null,
          linkedin_url: snapshotLead.linkedin_url ?? null,
          company_name: snapshotLead.company?.name ?? null,
          company_linkedin_url: snapshotLead.company?.linkedin_url ?? null,
          company_website: snapshotLead.company?.website ?? null,
          raw_data: snapshotLead.raw_data ?? null
        }));
      } else {
        throw new AppError(buildMissingTableMessage('leads'), 500);
      }
    } else {
      throw new AppError(`Failed to fetch leads: ${leadsError.message}`, 500);
    }
  }

  return {
    search: {
      ...search,
      prompt: search.prompt ?? search.query ?? '',
      total_results: search.total_results ?? search.result_count ?? 0,
      credits_charged: search.credits_charged ?? search.credits_used ?? 0,
      lead_snapshot: search.lead_snapshot ?? null
    },
    leads:
      (leads || []).map((lead) => ({
        ...lead,
        title: lead.title ?? null,
        linkedin_url: lead.linkedin_url ?? null,
        company_name: lead.company_name ?? null,
        company_linkedin_url: lead.company_linkedin_url ?? null,
        company_website: lead.company_website ?? null
      })) || []
  };
}

async function deleteSearch(userId, searchId) {
  let { error } = await supabase
    .from('searches')
    .delete()
    .eq('id', searchId)
    .eq('user_id', userId);

  if (error && isMissingColumnError(error, 'user_id')) {
    ({ error } = await supabase.from('searches').delete().eq('id', searchId));
  }

  if (error) {
    if (isMissingTableError(error, 'searches')) {
      throw new AppError(buildMissingTableMessage('searches'), 500);
    }
    throw new AppError(`Failed to delete search: ${error.message}`, 500);
  }
}

async function getCreditBalance(userId) {
  // 1. Try to get from credits table (new schema)
  try {
    const { data, error } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      return data.balance ?? 0;
    }
  } catch (e) { }

  // 2. Try to get from users table (legacy/old schema)
  try {
    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      return data.credits ?? 0;
    }
  } catch (e) { }

  return env.INITIAL_CREDITS;
}

async function getReadyGlobalCacheByHash(filterHash) {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('global_search_cache')
    .select('*')
    .eq('filter_hash', filterHash)
    .eq('status', 'ready')
    .gt('expires_at', nowIso)
    .maybeSingle();

  if (error) {
    if (
      isMissingColumnError(error, 'filter_hash') ||
      isMissingColumnError(error, 'status') ||
      isMissingColumnError(error, 'expires_at')
    ) {
      const legacy = await supabase.from('global_search_cache').select('*').eq('query', filterHash).maybeSingle();
      if (!legacy.error && legacy.data) {
        const legacyResults = legacy.data.results && typeof legacy.data.results === 'object' ? legacy.data.results : {};
        return {
          ...legacy.data,
          filter_hash: filterHash,
          status: 'ready',
          total_results: legacyResults.total_results || 0
        };
      }
      return null;
    }
    if (isMissingTableError(error, 'global_search_cache')) return null;
    throw new AppError(`Failed to read global cache: ${error.message}`, 500);
  }

  return data || null;
}

async function getAnyGlobalCacheByHash(filterHash) {
  const { data, error } = await supabase
    .from('global_search_cache')
    .select('*')
    .eq('filter_hash', filterHash)
    .maybeSingle();

  if (error) {
    if (isMissingColumnError(error, 'filter_hash')) {
      const legacy = await supabase.from('global_search_cache').select('*').eq('query', filterHash).maybeSingle();
      return legacy.error ? null : legacy.data || null;
    }
    if (isMissingTableError(error, 'global_search_cache')) return null;
    throw new AppError(`Failed to read global cache: ${error.message}`, 500);
  }

  return data || null;
}

async function createOrGetPendingGlobalCache(filterHash, canonicalFilters, expiresAt, provider = 'explorium') {
  const existing = await getAnyGlobalCacheByHash(filterHash);
  if (existing) return existing;

  const payload = {
    filter_hash: filterHash,
    canonical_filters: canonicalFilters,
    status: 'pending',
    provider,
    expires_at: expiresAt,
    hit_count: 0,
    last_hit_at: null
  };

  const { data, error } = await supabase
    .from('global_search_cache')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    if (
      isMissingColumnError(error, 'filter_hash') ||
      isMissingColumnError(error, 'canonical_filters') ||
      isMissingColumnError(error, 'status')
    ) {
      const legacyExisting = await getAnyGlobalCacheByHash(filterHash);
      if (legacyExisting) return legacyExisting;
      const legacyInsert = await supabase
        .from('global_search_cache')
        .insert({
          query: filterHash,
          results: null
        })
        .select('*')
        .single();
      if (legacyInsert.error) return null;
      return legacyInsert.data;
    }
    if (isMissingTableError(error, 'global_search_cache')) return null;
    if (String(error.code || '').toLowerCase() === '23505') {
      return getAnyGlobalCacheByHash(filterHash);
    }
    throw new AppError(`Failed to create global cache row: ${error.message}`, 500);
  }

  return data;
}

async function markGlobalCacheReady(cacheId, totalResults, expiresAt) {
  const { data, error } = await supabase
    .from('global_search_cache')
    .update({
      status: 'ready',
      total_results: totalResults || 0,
      expires_at: expiresAt,
      error_message: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', cacheId)
    .select('*')
    .single();

  if (error) {
    if (
      isMissingColumnError(error, 'status') ||
      isMissingColumnError(error, 'total_results') ||
      isMissingColumnError(error, 'expires_at') ||
      isMissingColumnError(error, 'error_message') ||
      isMissingColumnError(error, 'updated_at')
    ) {
      const legacyUpdate = await supabase
        .from('global_search_cache')
        .update({
          results: {
            total_results: totalResults || 0,
            expires_at: expiresAt
          }
        })
        .eq('id', cacheId)
        .select('*')
        .single();
      if (legacyUpdate.error) return null;
      return {
        ...legacyUpdate.data,
        total_results: totalResults || 0,
        status: 'ready'
      };
    }
    if (isMissingTableError(error, 'global_search_cache')) return null;
    throw new AppError(`Failed to mark cache ready: ${error.message}`, 500);
  }

  return data;
}

async function markGlobalCacheFailed(cacheId, errorMessage) {
  const { error } = await supabase
    .from('global_search_cache')
    .update({
      status: 'failed',
      error_message: String(errorMessage || 'Unknown error').slice(0, 500),
      updated_at: new Date().toISOString()
    })
    .eq('id', cacheId);

  if (
    error &&
    !isMissingTableError(error, 'global_search_cache') &&
    !isMissingColumnError(error, 'status') &&
    !isMissingColumnError(error, 'error_message') &&
    !isMissingColumnError(error, 'updated_at')
  ) {
    throw new AppError(`Failed to mark cache failed: ${error.message}`, 500);
  }
}

async function touchGlobalCacheHit(cacheId) {
  const { data, error } = await supabase
    .from('global_search_cache')
    .select('hit_count')
    .eq('id', cacheId)
    .maybeSingle();

  if (error) {
    if (isMissingColumnError(error, 'hit_count')) return;
    if (isMissingTableError(error, 'global_search_cache')) return;
    return;
  }

  const hitCount = (data?.hit_count || 0) + 1;
  await supabase
    .from('global_search_cache')
    .update({
      hit_count: hitCount,
      last_hit_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', cacheId);
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

  const { data, error } = await supabase
    .from('global_cached_leads')
    .insert(records)
    .select('*');

  if (error) {
    if (
      isMissingColumnError(error, 'cache_id') ||
      isMissingColumnError(error, 'lead_rank') ||
      isMissingColumnError(error, 'company_name')
    ) {
      const legacyRecords = safeNormalized.map((lead, index) => ({
        search_cache_id: cacheId,
        lead_data: {
          name: lead.name ?? null,
          title: lead.title ?? null,
          linkedin_url: lead.linkedin_url ?? null,
          company: {
            name: lead.company?.name ?? null,
            linkedin_url: lead.company?.linkedin_url ?? null,
            website: lead.company?.website ?? null
          },
          raw_data: safeRaw[index] || null
        }
      }));

      const legacyInsert = await supabase.from('global_cached_leads').insert(legacyRecords).select('*');
      if (!legacyInsert.error) return legacyInsert.data || [];
      return [];
    }
    if (isMissingTableError(error, 'global_cached_leads')) return [];
    throw new AppError(`Failed to save global cached leads: ${error.message}`, 500);
  }

  return data || [];
}

async function getGlobalCachedLeads(cacheId) {
  const { data, error } = await supabase
    .from('global_cached_leads')
    .select('*')
    .eq('cache_id', cacheId)
    .order('lead_rank', { ascending: true });

  if (error) {
    if (isMissingColumnError(error, 'cache_id') || isMissingColumnError(error, 'lead_rank')) {
      const legacy = await supabase
        .from('global_cached_leads')
        .select('*')
        .eq('search_cache_id', cacheId)
        .order('created_at', { ascending: true });
      if (legacy.error) return [];
      return (legacy.data || []).map((row, index) => {
        const leadData = row.lead_data && typeof row.lead_data === 'object' ? row.lead_data : {};
        return {
          id: row.id,
          cache_id: cacheId,
          lead_rank: index,
          name: leadData.name ?? null,
          title: leadData.title ?? null,
          linkedin_url: leadData.linkedin_url ?? null,
          company_name: leadData.company?.name ?? null,
          company_linkedin_url: leadData.company?.linkedin_url ?? null,
          company_website: leadData.company?.website ?? null,
          raw_data: leadData.raw_data ?? null,
          created_at: row.created_at
        };
      });
    }
    if (isMissingTableError(error, 'global_cached_leads')) return [];
    throw new AppError(`Failed to fetch global cached leads: ${error.message}`, 500);
  }

  return data || [];
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
