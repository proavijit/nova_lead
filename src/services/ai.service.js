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
- linkedin_category: e.g. ["software development", "financial services"]
- job_level: ["entry","manager","director","vp","cxo","c-suite","founder"]
- job_department: ["sales","marketing","engineering","finance","hr","operations"]

Output ONLY a raw JSON object like:
{
  "size": 5,
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

async function parseNLToFilters(prompt) {
  try {
    const response = await openrouter.post('/chat/completions', {
      model: env.OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    });

    const raw = (response.data.choices[0].message.content || '').trim();

    // Strip markdown code fences if present
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
    throw new AppError('Failed to parse filters from AI', 502);
  }
}

module.exports = { parseNLToFilters };
