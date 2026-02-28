const { supabase } = require('../config/db');
const { AppError } = require('../utils/apiError');
const { getEnv } = require('../config/env');

const env = getEnv();

function isUsersTableMissing(error) {
  return (
    !!error &&
    typeof error.message === 'string' &&
    (error.message.includes("Could not find the table 'public.users' in the schema cache") ||
      error.message.toLowerCase().includes('public.users'))
  );
}

function isMissingColumn(error, table, column) {
  return (
    !!error &&
    typeof error.message === 'string' &&
    (error.message.toLowerCase().includes(`column ${table.toLowerCase()}.${column.toLowerCase()} does not exist`) ||
      error.message.toLowerCase().includes(`could not find the '${column.toLowerCase()}' column`))
  );
}

async function getBalanceFromUsers(userId) {
  const { data, error } = await supabase.from('users').select('credits').eq('id', userId).single();
  if (error) return { balance: null, error };
  return { balance: data?.credits ?? 0, error: null };
}

async function getBalanceFromCreditsTable(userId) {
  const { data, error } = await supabase.from('credits').select('balance').eq('user_id', userId).single();
  if (error) return { balance: null, error };
  return { balance: data?.balance ?? 0, error: null };
}

async function setBalanceCreditsTable(userId, balance) {
  const current = await supabase.from('credits').select('id').eq('user_id', userId).maybeSingle();
  if (current.error) {
    throw new AppError(`Failed to update credits table: ${current.error.message}`, 500);
  }

  if (current.data?.id) {
    const { error } = await supabase.from('credits').update({ balance }).eq('id', current.data.id);
    if (error) throw new AppError(`Failed to update credits table: ${error.message}`, 500);
    return;
  }

  const { error } = await supabase.from('credits').insert({ user_id: userId, balance });
  if (error) {
    throw new AppError(`Failed to insert credits row: ${error.message}`, 500);
  }
}

async function recordTransaction(userId, amount, reason = 'search', searchId = null) {
  let { error } = await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount,
    reason,
    search_id: searchId
  });

  if (error && (isMissingColumn(error, 'credit_transactions', 'amount') || isMissingColumn(error, 'credit_transactions', 'reason'))) {
    ({ error } = await supabase.from('credit_transactions').insert({
      user_id: userId,
      credits_used: Math.abs(amount)
    }));
  }

  if (error) {
    throw new AppError(`Failed to record credit transaction: ${error.message}`, 500);
  }
}

async function checkCredits(userId, cost) {
  const usersBalance = await getBalanceFromUsers(userId);
  if (!usersBalance.error) {
    if ((usersBalance.balance ?? 0) < cost) throw new AppError('Insufficient credits', 402);
    return usersBalance.balance;
  }

  if (isUsersTableMissing(usersBalance.error) || isMissingColumn(usersBalance.error, 'users', 'credits')) {
    const legacyBalance = await getBalanceFromCreditsTable(userId);
    if (!legacyBalance.error) {
      if ((legacyBalance.balance ?? 0) < cost) throw new AppError('Insufficient credits', 402);
      return legacyBalance.balance;
    }
    if (legacyBalance.error?.code === 'PGRST116') {
      if (env.INITIAL_CREDITS < cost) throw new AppError('Insufficient credits', 402);
      return env.INITIAL_CREDITS;
    }
  }

  throw new AppError('Failed to fetch credits', 500);
}

async function deductCredits(userId, cost, searchId) {
  const usersBalance = await getBalanceFromUsers(userId);
  if (!usersBalance.error) {
    const newCredits = (usersBalance.balance ?? 0) - cost;
    if (newCredits < 0) throw new AppError('Insufficient credits', 402);

    const { error: updateError } = await supabase.from('users').update({ credits: newCredits }).eq('id', userId);
    if (updateError) throw new AppError('Failed to deduct credits', 500);
    await recordTransaction(userId, -cost, 'search', searchId);
    return newCredits;
  }

  if (isUsersTableMissing(usersBalance.error) || isMissingColumn(usersBalance.error, 'users', 'credits')) {
    const legacyBalance = await getBalanceFromCreditsTable(userId);
    const current = legacyBalance.error && legacyBalance.error.code === 'PGRST116' ? env.INITIAL_CREDITS : legacyBalance.balance;
    if (legacyBalance.error && legacyBalance.error.code !== 'PGRST116') {
      throw new AppError('Failed to deduct credits', 500);
    }
    const newCredits = (current ?? 0) - cost;
    if (newCredits < 0) throw new AppError('Insufficient credits', 402);
    await setBalanceCreditsTable(userId, newCredits);
    await recordTransaction(userId, -cost, 'search', searchId);
    return newCredits;
  }

  throw new AppError('Failed to deduct credits', 500);
}

async function addCredits(userId, amount, reason = 'top_up', searchId = null) {
  const usersBalance = await getBalanceFromUsers(userId);
  if (!usersBalance.error) {
    const newCredits = (usersBalance.balance ?? 0) + amount;
    const { error: updateError } = await supabase.from('users').update({ credits: newCredits }).eq('id', userId);
    if (updateError) throw new AppError('Failed to add credits', 500);
    await recordTransaction(userId, amount, reason, searchId);
    return newCredits;
  }

  if (isUsersTableMissing(usersBalance.error) || isMissingColumn(usersBalance.error, 'users', 'credits')) {
    const legacyBalance = await getBalanceFromCreditsTable(userId);
    const current = legacyBalance.error && legacyBalance.error.code === 'PGRST116' ? env.INITIAL_CREDITS : legacyBalance.balance;
    if (legacyBalance.error && legacyBalance.error.code !== 'PGRST116') {
      throw new AppError('Failed to add credits', 500);
    }
    const newCredits = (current ?? 0) + amount;
    await setBalanceCreditsTable(userId, newCredits);
    await recordTransaction(userId, amount, reason, searchId);
    return newCredits;
  }

  throw new AppError('Failed to add credits', 500);
}

async function getCreditHistory(userId) {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError('Failed to fetch credit history', 500);
  }

  return data || [];
}

module.exports = {
  checkCredits,
  deductCredits,
  addCredits,
  getCreditHistory
};
