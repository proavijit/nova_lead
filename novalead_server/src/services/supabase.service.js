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

  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: authUserId,
        email,
        password_hash: passwordHash,
        credits: env.INITIAL_CREDITS
      },
      { onConflict: 'id' }
    )
    .select('id, email, credits, created_at')
    .single();

  if (error) {
    if (isUsersTableCacheError(error)) {
      return {
        id: authUserId,
        email,
        credits: env.INITIAL_CREDITS,
        created_at: new Date().toISOString()
      };
    }

    await supabase.auth.admin.deleteUser(authUserId);
    throw new AppError(`Failed to create user profile: ${error.message}`, 500);
  }

  return data;
}

async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, password_hash, credits')
    .eq('email', email)
    .single();

  if (error) {
    return null;
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
    .select('id, email, credits, created_at')
    .eq('id', id)
    .single();

  if (error) {
    throw new AppError('User not found', 404);
  }

  return data;
}

async function saveSearch(userId, prompt, filters, totalResults) {
  const { data, error } = await supabase
    .from('searches')
    .insert({
      user_id: userId,
      prompt,
      filters,
      total_results: totalResults
    })
    .select('id, user_id, prompt, filters, total_results, created_at')
    .single();

  if (error) {
    throw new AppError('Failed to save search', 500);
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
    throw new AppError('Failed to save leads', 500);
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
    throw new AppError('Failed to list searches', 500);
  }

  return {
    items: data || [],
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
    throw new AppError('Search not found', 404);
  }

  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .eq('search_id', searchId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (leadsError) {
    throw new AppError('Failed to fetch leads', 500);
  }

  return {
    search,
    leads: leads || []
  };
}

async function deleteSearch(userId, searchId) {
  const { error } = await supabase
    .from('searches')
    .delete()
    .eq('id', searchId)
    .eq('user_id', userId);

  if (error) {
    throw new AppError('Failed to delete search', 500);
  }
}

async function getCreditBalance(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error) {
    if (isUsersTableCacheError(error)) {
      return env.INITIAL_CREDITS;
    }
    throw new AppError('Failed to fetch credit balance', 500);
  }

  return data.credits ?? 0;
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
  getCreditBalance
};
