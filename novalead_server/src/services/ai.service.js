const openrouter = require('../config/openrouter');
const { AppError } = require('../utils/apiError');
const { getEnv } = require('../config/env');

const env = getEnv();

const SYSTEM_PROMPT = `
You are an API filter builder for the Explorium Prospects API.
Convert user natural language into a valid JSON filter object.

Valid filter keys:
- country_code: ISO 2-letter codes e.g. ["us", "ca"]
- company_size: ["1-10","11-50","51-200","201-500","501-1000","1001-5000","5001-10000","10001+"]
- linkedin_category: Use ONLY valid categories like "software development", "it services and it consulting", "technology, information and internet", "financial services", "business consulting and services", "marketing services"
- job_level: ["entry","manager","director","vp","cxo","c-suite","founder"]
- job_department: ["sales","marketing","engineering","finance","hr","operations"]

Output ONLY a raw JSON object like:
{
  "mode": "full",
  "size": 5,
  "page_size": 5,
  "page": 1,
  "filters": {
    "country_code": { "values": ["ca"] },
    "company_size": { "values": ["51-200","201-500"] },
    "linkedin_category": { "values": ["financial services"] },
    "job_level": { "values": ["cxo","founder"] },
    "job_department": { "values": ["engineering"] }
  }
}

No markdown, no explanation, only valid JSON.
`;

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

async function parseNLToFilters(prompt) {
  // Re-read env at call time, not module-load time, to handle Vercel cold starts
  const currentEnv = getEnv();

  // Diagnostic: log key availability on every AI call in production
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const rawKey = process.env.OPENROUTER_API_KEY;
    const envKey = currentEnv.OPENROUTER_API_KEY;
    console.log('[AI SERVICE] Diagnostics:', {
      rawKeyDefined: rawKey !== undefined,
      rawKeyLength: rawKey?.length ?? 0,
      rawKeyPrefix: rawKey ? rawKey.slice(0, 12) + '...' : '(not set)',
      rawKeyHasNewline: rawKey ? /[\r\n]/.test(rawKey) : false,
      rawKeyHasQuotes: rawKey ? /["']/.test(rawKey) : false,
      envKeyDefined: envKey !== undefined,
      envKeyLength: envKey?.length ?? 0,
      envKeyPrefix: envKey ? envKey.slice(0, 12) + '...' : '(not set)',
      model: currentEnv.OPENROUTER_MODEL,
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV || '(not set)'
    });
  }

  try {
    const response = await requestWithRetry(() =>
      openrouter.post('/chat/completions', {
        model: currentEnv.OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      })
    );

    const raw = (response.data.choices[0].message.content || '').trim();

    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '');

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      throw new AppError('AI returned invalid JSON', 422);
    }
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    const status = err?.response?.status;
    const code = err?.code;
    const responseBody = err?.response?.data;

    const keyPrefix = currentEnv.OPENROUTER_API_KEY
      ? currentEnv.OPENROUTER_API_KEY.slice(0, 12) + '...'
      : '(not set)';

    if (status === 401) {
      console.error('[AI SERVICE] 401 Unauthorized - Full diagnostic:', {
        keyPrefix,
        keyLength: currentEnv.OPENROUTER_API_KEY?.length ?? 0,
        responseBody: JSON.stringify(responseBody),
        rawProcessEnvKeyPrefix: process.env.OPENROUTER_API_KEY
          ? process.env.OPENROUTER_API_KEY.slice(0, 12) + '...'
          : '(not set in process.env)',
        rawProcessEnvKeyLength: process.env.OPENROUTER_API_KEY?.length ?? 0,
        isVercel: !!process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV || '(not set)'
      });
      throw new AppError(
        'AI service returned 401 Unauthorized. Check OPENROUTER_API_KEY in Vercel env vars. See server logs for diagnostic details.',
        503
      );
    }

    console.error('[AI SERVICE] Request failed:', {
      status,
      code,
      keyPrefix,
      responseBody: JSON.stringify(responseBody),
      message: err?.message
    });

    throw new AppError(
      `Failed to parse filters from AI${status ? ` (status ${status})` : ''}${code ? ` [${code}]` : ''}`,
      503
    );
  }
}

module.exports = { parseNLToFilters };
