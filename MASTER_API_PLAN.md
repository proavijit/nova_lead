# 🏗️ MASTER API ARCHITECTURE PLAN
## AI-Powered Lead Prospecting SaaS — Express + Supabase + OpenRouter + Explorium

---

## 1. FOLDER STRUCTURE (MVC Pattern)

```
lead-prospecting-api/
│
├── src/
│   ├── config/
│   │   ├── db.js                  # Supabase client init
│   │   ├── openrouter.js          # OpenRouter axios instance
│   │   ├── explorium.js           # Explorium axios instance
│   │   └── env.js                 # Centralized env validation
│   │
│   ├── controllers/
│   │   ├── auth.controller.js     # Register, login, JWT issue
│   │   ├── prospect.controller.js # NL → filter → search → save
│   │   ├── credit.controller.js   # Get balance, add credits
│   │   └── search.controller.js   # Get saved searches, history
│   │
│   ├── services/
│   │   ├── ai.service.js          # OpenRouter: NL → Explorium JSON
│   │   ├── explorium.service.js   # Call Explorium API
│   │   ├── normalizer.service.js  # Raw response → lead schema
│   │   ├── credit.service.js      # Deduct/add/check credits
│   │   └── supabase.service.js    # All DB read/write operations
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verify
│   │   ├── rateLimit.middleware.js # express-rate-limit config
│   │   ├── credit.middleware.js   # Check credit before search
│   │   └── validate.middleware.js # Joi schema validation
│   │
│   ├── validators/
│   │   ├── prospect.validator.js  # Joi: prompt, page, size
│   │   └── filterSchema.js        # Joi: Explorium filter JSON shape
│   │
│   ├── routes/
│   │   ├── index.js               # Mount all routers
│   │   ├── auth.routes.js
│   │   ├── prospect.routes.js
│   │   ├── credit.routes.js
│   │   └── search.routes.js
│   │
│   ├── utils/
│   │   ├── logger.js              # Winston logger
│   │   ├── errorHandler.js        # Global error handler
│   │   ├── apiError.js            # Custom AppError class
│   │   └── constants.js           # CREDIT_COST, filter enums
│   │
│   └── app.js                     # Express app setup
│
├── .env
├── .env.example
├── package.json
└── server.js                      # Entry point
```

---

## 2. ENVIRONMENT VARIABLES (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d

# OpenRouter
OPENROUTER_API_KEY=sk-or-xxxx
OPENROUTER_MODEL=openai/gpt-4o

# Explorium
EXPLORIUM_API_KEY=your_explorium_key
EXPLORIUM_BASE_URL=https://api.explorium.ai

# Credits
CREDIT_COST_PER_SEARCH=1
```

---

## 3. SUPABASE TABLE SCHEMA

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### searches
```sql
CREATE TABLE searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  filters JSONB NOT NULL,
  total_results INTEGER,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### leads
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID REFERENCES searches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  title TEXT,
  linkedin_url TEXT,
  company_name TEXT,
  company_linkedin_url TEXT,
  company_website TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### credit_transactions
```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,         -- negative = deduct, positive = add
  reason TEXT,                     -- 'search', 'top_up', 'refund'
  search_id UUID REFERENCES searches(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. ALL API ENDPOINTS

### Auth Routes — `/api/v1/auth`
| Method | Endpoint    | Description              |
|--------|-------------|--------------------------|
| POST   | /register   | Create account           |
| POST   | /login      | Get JWT token            |
| GET    | /me         | Get current user info    |

### Prospect Routes — `/api/v1/prospects`
| Method | Endpoint    | Description                        |
|--------|-------------|------------------------------------|
| POST   | /search     | NL prompt → AI → Explorium → leads |

### Search History Routes — `/api/v1/searches`
| Method | Endpoint    | Description               |
|--------|-------------|---------------------------|
| GET    | /           | List all searches (paged) |
| GET    | /:id        | Get one search + its leads|
| DELETE | /:id        | Delete saved search       |

### Credit Routes — `/api/v1/credits`
| Method | Endpoint    | Description              |
|--------|-------------|--------------------------|
| GET    | /balance    | Get current balance      |
| GET    | /history    | Transaction log          |
| POST   | /add        | Admin: top up credits    |

---

## 5. CORE FLOW — POST /api/v1/prospects/search

```
Client Request
  │  { prompt: "Find 5 CTOs at fintech in Canada 50-500 employees" }
  ▼
auth.middleware.js       → verify JWT, attach req.user
credit.middleware.js     → check user.credits >= CREDIT_COST
validate.middleware.js   → Joi validate req.body.prompt
  │
  ▼
prospect.controller.js
  │
  ├─► ai.service.js
  │     └─ POST OpenRouter API
  │         system: "You are an API filter builder for Explorium..."
  │         user: prompt
  │         → returns raw JSON string
  │
  ├─► validateFilter(parsed JSON)  [filterSchema.js]
  │     └─ Joi validates shape: filters.country_code, job_level, etc.
  │
  ├─► explorium.service.js
  │     └─ POST https://api.explorium.ai/v1/prospects
  │         with parsed filters + pagination
  │
  ├─► normalizer.service.js
  │     └─ raw[] → LeadDTO[]
  │         { name, title, linkedin_url, company: {...} }
  │
  ├─► credit.service.js
  │     └─ deductCredits(userId, cost)
  │
  └─► supabase.service.js
        ├─ INSERT INTO searches
        ├─ INSERT INTO leads (bulk)
        └─ INSERT INTO credit_transactions
  │
  ▼
Response: { success, credits_remaining, total, page, leads[] }
```

---

## 6. SERVICE IMPLEMENTATIONS

### src/services/ai.service.js
```javascript
const openrouter = require('../config/openrouter');

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
  const response = await openrouter.post('/chat/completions', {
    model: process.env.OPENROUTER_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1
  });

  const raw = response.data.choices[0].message.content.trim();

  // Strip markdown code blocks if AI wraps in ```json
  const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  
  return JSON.parse(cleaned);
}

module.exports = { parseNLToFilters };
```

### src/services/normalizer.service.js
```javascript
function normalizeLead(raw) {
  return {
    name: raw.full_name || null,
    title: raw.job_title || null,
    linkedin_url: raw.linkedin
      ? raw.linkedin.startsWith('http')
        ? raw.linkedin
        : `https://${raw.linkedin}`
      : null,
    company: {
      name: raw.company_name || null,
      linkedin_url: raw.company_linkedin
        ? raw.company_linkedin.startsWith('http')
          ? raw.company_linkedin
          : `https://${raw.company_linkedin}`
        : null,
      website: raw.company_website || null
    }
  };
}

function normalizeAll(rawArray) {
  return rawArray.map(normalizeLead);
}

module.exports = { normalizeAll };
```

### src/services/credit.service.js
```javascript
const { supabase } = require('../config/db');
const { AppError } = require('../utils/apiError');

async function checkCredits(userId, cost) {
  const { data, error } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error) throw new AppError('Failed to fetch credits', 500);
  if (data.credits < cost) throw new AppError('Insufficient credits', 402);
  return data.credits;
}

async function deductCredits(userId, cost, searchId) {
  const { error: updateError } = await supabase
    .from('users')
    .update({ credits: supabase.rpc('decrement_credits', { amount: cost }) })
    .eq('id', userId);

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: -cost,
    reason: 'search',
    search_id: searchId
  });
}

module.exports = { checkCredits, deductCredits };
```

---

## 7. CONTROLLER — prospect.controller.js

```javascript
const { parseNLToFilters } = require('../services/ai.service');
const { searchProspects } = require('../services/explorium.service');
const { normalizeAll } = require('../services/normalizer.service');
const { deductCredits } = require('../services/credit.service');
const { saveSearch, saveLeads } = require('../services/supabase.service');
const { validateFilter } = require('../validators/filterSchema');
const { AppError } = require('../utils/apiError');
const constants = require('../utils/constants');

exports.searchProspects = async (req, res, next) => {
  try {
    const { prompt, page = 1 } = req.body;
    const userId = req.user.id;

    // Step 1: AI parse
    const parsed = await parseNLToFilters(prompt);

    // Step 2: Validate AI output
    const { error } = validateFilter(parsed);
    if (error) throw new AppError(`AI produced invalid filters: ${error.message}`, 422);

    // Step 3: Override page from client
    parsed.page = page;

    // Step 4: Call Explorium
    const exploResult = await searchProspects(parsed);

    // Step 5: Normalize
    const leads = normalizeAll(exploResult.data || []);

    // Step 6: Save to DB
    const search = await saveSearch(userId, prompt, parsed, exploResult.total_results);
    await saveLeads(userId, search.id, leads, exploResult.data);

    // Step 7: Deduct credits
    await deductCredits(userId, constants.CREDIT_COST_PER_SEARCH, search.id);

    res.json({
      success: true,
      search_id: search.id,
      credits_remaining: req.user.credits - constants.CREDIT_COST_PER_SEARCH,
      total_results: exploResult.total_results,
      page,
      leads
    });

  } catch (err) {
    next(err);
  }
};
```

---

## 8. VALIDATION LAYER

### src/validators/filterSchema.js
```javascript
const Joi = require('joi');

const valuesObj = Joi.object({ values: Joi.array().items(Joi.string()).min(1) });

const filterSchema = Joi.object({
  size: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1),
  filters: Joi.object({
    country_code: valuesObj,
    company_size: valuesObj,
    linkedin_category: valuesObj,
    job_level: valuesObj,
    job_department: valuesObj
  }).required()
});

function validateFilter(data) {
  return filterSchema.validate(data, { allowUnknown: false });
}

module.exports = { validateFilter };
```

---

## 9. ERROR HANDLING STRATEGY

### src/utils/apiError.js
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
module.exports = { AppError };
```

### src/utils/errorHandler.js
```javascript
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';
  
  // Log non-operational (unexpected) errors
  if (!err.isOperational) console.error('[FATAL]', err);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

**Error scenarios handled:**
- AI returns invalid JSON → 422 with message
- AI returns unknown filter keys → Joi rejects → 422
- Explorium API down → 502 Bad Gateway
- Insufficient credits → 402 Payment Required
- Invalid JWT → 401 Unauthorized
- Supabase write fails → 500 (logged internally)

---

## 10. RATE LIMITING

```javascript
// src/middleware/rateLimit.middleware.js
const rateLimit = require('express-rate-limit');

exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { success: false, error: 'Too many requests' }
});

exports.searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
  message: { success: false, error: 'Search rate limit exceeded' }
});
```

---

## 11. CONFIG FILES

### src/config/openrouter.js
```javascript
const axios = require('axios');

const openrouter = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-app.com',
    'X-Title': 'Lead Prospecting SaaS'
  }
});

module.exports = openrouter;
```

### src/config/explorium.js
```javascript
const axios = require('axios');

const explorium = axios.create({
  baseURL: process.env.EXPLORIUM_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'api_key': process.env.EXPLORIUM_API_KEY
  }
});

module.exports = explorium;
```

### src/config/db.js
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = { supabase };
```

---

## 12. SECURITY RECOMMENDATIONS

| Concern | Solution |
|---|---|
| API Key Exposure | All keys in `.env`, never committed |
| JWT Brute Force | Short expiry + refresh token pattern |
| SQL Injection | Supabase parameterized queries by default |
| Prompt Injection | System prompt isolation in ai.service |
| Mass Assignment | Joi strips unknown fields |
| CORS | `cors` package with whitelist |
| Helmet | `helmet()` middleware on all routes |
| Credit Abuse | Atomic DB update + transaction log |

---

## 13. PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "axios": "^1.x",
    "bcryptjs": "^2.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "express": "^4.x",
    "express-rate-limit": "^7.x",
    "helmet": "^7.x",
    "joi": "^17.x",
    "jsonwebtoken": "^9.x",
    "morgan": "^1.x",
    "winston": "^3.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
```

---

## 14. SCALABILITY PLAN

- **Pagination**: All list endpoints accept `?page=&limit=` with Supabase `.range()`
- **Queue**: For high volume, wrap Explorium calls in Bull/BullMQ job queue
- **Caching**: Cache duplicate prompts → same filter results for 1hr via Redis
- **Webhooks**: Future: notify user when async search job completes
- **Multi-tenant**: `user_id` on all rows enables per-user isolation already

---

## 15. FUTURE EXTENSIBILITY

- Add `POST /prospects/export` → CSV download of leads
- Add `PATCH /searches/:id/tags` → label searches
- Add OpenRouter model selection per user (premium feature)
- Add Stripe integration for credit top-up via `POST /credits/purchase`
- Add team/workspace model (one credit pool per org)
- Add webhook for real-time lead push to CRM (HubSpot, Salesforce)

---

## 16. QUICK START SEQUENCE

```bash
# 1. Init
npm init -y
npm install express axios @supabase/supabase-js jsonwebtoken bcryptjs joi dotenv cors helmet express-rate-limit morgan winston

# 2. Create .env from .env.example, fill real keys

# 3. Run Supabase SQL migrations (tables above)

# 4. Start
node server.js
# or
npx nodemon server.js
```

---

**Designed for agent-based implementation. Each file is independent and injectable. Follow the flow: Routes → Controller → Service → Config. No circular dependencies.**
