const explorium = require('../config/explorium');
const { AppError } = require('../utils/apiError');

const RETRYABLE_ERR_CODES = new Set(['ECONNABORTED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN']);

function shouldRetry(err) {
  const status = err?.response?.status;
  return RETRYABLE_ERR_CODES.has(err?.code) || status === 429 || (status >= 500 && status <= 599);
}

async function requestWithRetry(requestFn, retries = 1) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFn();
    } catch (err) {
      lastErr = err;
      if (attempt === retries || !shouldRetry(err)) break;
    }
  }
  throw lastErr;
}

async function searchProspects(filtersPayload) {
  try {
    const response = await requestWithRetry(() => explorium.post('/v1/prospects', filtersPayload));

    return {
      data: response.data?.data || [],
      total_results: response.data?.total_results || 0
    };
  } catch (err) {
    const status = err?.response?.status;
    const code = err?.code;
    throw new AppError(`Failed to fetch prospects from Explorium${status ? ` (status ${status})` : ''}${code ? ` [${code}]` : ''}`, 502);
  }
}

module.exports = { searchProspects };
