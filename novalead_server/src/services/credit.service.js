const { supabase } = require('../config/db');
const { AppError } = require('../utils/apiError');

async function checkCredits(userId, cost) {
  const { data, error } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error) {
    throw new AppError('Failed to fetch credits', 500);
  }

  if ((data.credits ?? 0) < cost) {
    throw new AppError('Insufficient credits', 402);
  }

  return data.credits;
}

async function deductCredits(userId, cost, searchId) {
  const { data, error } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError('Failed to deduct credits', 500);
  }

  const currentCredits = data.credits ?? 0;
  const newCredits = currentCredits - cost;

  if (newCredits < 0) {
    throw new AppError('Insufficient credits', 402);
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ credits: newCredits })
    .eq('id', userId);

  if (updateError) {
    throw new AppError('Failed to deduct credits', 500);
  }

  const { error: txError } = await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: -cost,
    reason: 'search',
    search_id: searchId
  });

  if (txError) {
    throw new AppError('Failed to record credit transaction', 500);
  }

  return newCredits;
}

async function addCredits(userId, amount, reason = 'top_up', searchId = null) {
  const { data, error } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError('Failed to add credits', 500);
  }

  const currentCredits = data.credits ?? 0;
  const newCredits = currentCredits + amount;

  const { error: updateError } = await supabase
    .from('users')
    .update({ credits: newCredits })
    .eq('id', userId);

  if (updateError) {
    throw new AppError('Failed to add credits', 500);
  }

  const { error: txError } = await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount,
    reason,
    search_id: searchId
  });

  if (txError) {
    throw new AppError('Failed to record credit transaction', 500);
  }

  return newCredits;
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
