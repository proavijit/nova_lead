const openrouter = require('../config/openrouter');
const { AppError } = require('../utils/apiError');
const { getEnv } = require('../config/env');

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
  try {
    const response = await requestWithRetry(() =>
      openrouter.post('/chat/completions', {
        model: getEnv().OPENROUTER_MODEL,
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
    const responseData = err?.response?.data;

    const currentKey = getEnv().OPENROUTER_API_KEY;
    const keyDiag = {
      prefix: currentKey ? currentKey.slice(0, 10) + '...' : '(not set)',
      length: currentKey ? currentKey.length : 0,
      startsWithSkOr: currentKey ? currentKey.startsWith('sk-or-') : false,
      hasQuotes: currentKey ? (currentKey.includes('"') || currentKey.includes("'")) : false,
      hasNewlines: currentKey ? /[\r\n]/.test(currentKey) : false,
      rawEnvPrefix: process.env.OPENROUTER_API_KEY
        ? process.env.OPENROUTER_API_KEY.slice(0, 10) + '...'
        : '(raw not set)',
      rawEnvLength: process.env.OPENROUTER_API_KEY
        ? process.env.OPENROUTER_API_KEY.length
        : 0
    };

    if (status === 401) {
      console.error('[AI SERVICE] 401 Unauthorized. Key diagnostics:', keyDiag);
      console.error('[AI SERVICE] OpenRouter response body:', responseData);
      throw new AppError(
        'AI service returned 401 Unauthorized. The OPENROUTER_API_KEY is likely malformed, expired, or has extra characters. Check Vercel env vars for stray quotes or whitespace.',
        503
      );
    }

    console.error('[AI SERVICE] Request failed:', {
      status,
      code,
      keyDiag,
      message: err?.message,
      responseData
    });

    throw new AppError(
      `Failed to parse filters from AI${status ? ` (status ${status})` : ''}${code ? ` [${code}]` : ''}`,
      503
    );
  }
}

module.exports = { parseNLToFilters };
