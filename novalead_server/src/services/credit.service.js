const prisma = require('./prisma.service');
const { AppError } = require('../utils/apiError');
const { getEnv } = require('../config/env');

const env = getEnv();

async function getBalanceFromUsers(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });
    return { balance: user?.credits ?? 0, error: null };
  } catch (error) {
    return { balance: null, error };
  }
}

async function getBalanceFromCreditsTable(userId) {
  try {
    const credit = await prisma.credit.findUnique({
      where: { user_id: userId },
      select: { balance: true }
    });
    return { balance: credit?.balance ?? 0, error: null };
  } catch (error) {
    return { balance: null, error };
  }
}

async function setBalanceCreditsTable(userId, balance) {
  try {
    await prisma.credit.upsert({
      where: { user_id: userId },
      update: { balance },
      create: { user_id: userId, balance }
    });
  } catch (error) {
    throw new AppError(`Failed to update credits table: ${error.message}`, 500);
  }
}

async function recordTransaction(userId, amount, reason = 'search', searchId = null) {
  try {
    await prisma.creditTransaction.create({
      data: {
        user_id: userId,
        amount,
        reason,
        search_id: searchId
      }
    });
  } catch (error) {
    throw new AppError(`Failed to record credit transaction: ${error.message}`, 500);
  }
}

async function checkCredits(userId, cost) {
  const usersBalance = await getBalanceFromUsers(userId);
  if (!usersBalance.error) {
    if ((usersBalance.balance ?? 0) < cost) throw new AppError('Insufficient credits', 402);
    return usersBalance.balance;
  }

  const legacyBalance = await getBalanceFromCreditsTable(userId);
  if (!legacyBalance.error) {
    if ((legacyBalance.balance ?? 0) < cost) throw new AppError('Insufficient credits', 402);
    return legacyBalance.balance;
  }

  if (env.INITIAL_CREDITS < cost) throw new AppError('Insufficient credits', 402);
  return env.INITIAL_CREDITS;
}

async function deductCredits(userId, cost, searchId) {
  const usersBalance = await getBalanceFromUsers(userId);
  if (!usersBalance.error) {
    const newCredits = (usersBalance.balance ?? 0) - cost;
    if (newCredits < 0) throw new AppError('Insufficient credits', 402);

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: newCredits }
      });
      await recordTransaction(userId, -cost, 'search', searchId);
      return newCredits;
    } catch (error) {
      throw new AppError('Failed to deduct credits', 500);
    }
  }

  const legacyBalance = await getBalanceFromCreditsTable(userId);
  const current = legacyBalance.error ? env.INITIAL_CREDITS : legacyBalance.balance;

  const newCredits = (current ?? 0) - cost;
  if (newCredits < 0) throw new AppError('Insufficient credits', 402);

  try {
    await setBalanceCreditsTable(userId, newCredits);
    await recordTransaction(userId, -cost, 'search', searchId);
    return newCredits;
  } catch (error) {
    throw new AppError('Failed to deduct credits', 500);
  }
}

async function addCredits(userId, amount, reason = 'top_up', searchId = null) {
  const usersBalance = await getBalanceFromUsers(userId);
  if (!usersBalance.error) {
    const newCredits = (usersBalance.balance ?? 0) + amount;

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: newCredits }
      });
      await recordTransaction(userId, amount, reason, searchId);
      return newCredits;
    } catch (error) {
      throw new AppError('Failed to add credits', 500);
    }
  }

  const legacyBalance = await getBalanceFromCreditsTable(userId);
  const current = legacyBalance.error ? env.INITIAL_CREDITS : legacyBalance.balance;

  const newCredits = (current ?? 0) + amount;

  try {
    await setBalanceCreditsTable(userId, newCredits);
    await recordTransaction(userId, amount, reason, searchId);
    return newCredits;
  } catch (error) {
    throw new AppError('Failed to add credits', 500);
  }
}

async function getCreditHistory(userId) {
  try {
    const history = await prisma.creditTransaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    return history;
  } catch (error) {
    throw new AppError('Failed to fetch credit history', 500);
  }
}

module.exports = {
  checkCredits,
  deductCredits,
  addCredits,
  getCreditHistory
};
