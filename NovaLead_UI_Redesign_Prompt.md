# NovaLead Client — Full UI Redesign Prompt
## For Lovable / Cursor / v0 / Any AI Agent

---

## 🎯 CONTEXT & OBJECTIVE

You are redesigning the **frontend-only** of an existing React application called **NovaLead** — an AI-powered B2B Lead Discovery CRM. The live app is at `https://novaleadclient.vercel.app/`. The design reference is at `https://novalead-six.vercel.app/`.

**CRITICAL RULES:**
- ✅ Only modify frontend UI/UX code (components, styles, layouts)
- ✅ Keep ALL existing backend API calls, routes, auth logic, and state management intact
- ✅ Keep all existing functionality working (login, register, search, credits, CSV export, history)
- ❌ Do NOT change any API endpoint, backend logic, or data-fetching functions
- ❌ Do NOT remove any existing features or navigation links

---

## 📋 STEP 1 — FULL APPLICATION ANALYSIS (Do This First)

Before writing any code, analyze the existing app thoroughly:

1. Read ALL existing component files in `src/` directory
2. Map out ALL existing routes (Login, Register, Dashboard, New Search, Search History, Credits, Settings)
3. Identify ALL existing API calls and keep them untouched
4. Note the current color variables and theme tokens
5. List all existing UI components (buttons, cards, tables, forms, navbar, sidebar)
6. Check the dashboard layout from the screenshot: sidebar navigation on left, main content area on right, credits badge top-right, search results in a data table

---

## 🎨 STEP 2 — DESIGN SYSTEM (Apply Globally)

### Color Palette
```css
/* Primary Brand */
--color-primary: #2563EB;          /* Blue 600 - CTAs, active states */
--color-primary-dark: #1D4ED8;     /* Blue 700 - hover */
--color-primary-light: #DBEAFE;    /* Blue 100 - backgrounds */

/* Neutral */
--color-bg: #F8FAFC;               /* Page background */
--color-surface: #FFFFFF;          /* Card/panel surface */
--color-border: #E2E8F0;           /* Subtle borders */
--color-text-primary: #0F172A;     /* Headings */
--color-text-secondary: #64748B;   /* Body/subtext */
--color-text-muted: #94A3B8;       /* Placeholders, hints */

/* Accent */
--color-success: #10B981;          /* Green - verified, success */
--color-warning: #F59E0B;          /* Amber - credits warning */
--color-error: #EF4444;            /* Red - errors */

/* Sidebar */
--sidebar-bg: #0F172A;             /* Dark navy sidebar */
--sidebar-text: #CBD5E1;
--sidebar-active: #2563EB;
--sidebar-active-bg: rgba(37,99,235,0.15);
```

### Typography
```css
/* Use these Google Fonts */
--font-display: 'Plus Jakarta Sans', sans-serif;   /* Headings */
--font-body: 'DM Sans', sans-serif;               /* Body text */

/* Scale */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
```

### Spacing & Radius
```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 16px rgba(0,0,0,0.08);
--shadow-lg: 0 10px 40px rgba(0,0,0,0.12);
--shadow-blue: 0 4px 20px rgba(37,99,235,0.25);
```

---

## 🏠 STEP 3 — LANDING PAGE (Public Homepage `/`)

Completely redesign the landing page with ALL these sections. Content is dummy/placeholder — make it beautiful and professional:

### 3.1 — Navbar
- Logo left: NovaLead icon + "NovaLead" text in bold
- Nav links center: Features | How It Works | Pricing | Resources
- Right side: "Sign In" (ghost button) + "Start Free Trial" (filled blue button)
- Sticky on scroll with backdrop blur: `backdrop-filter: blur(12px); background: rgba(255,255,255,0.85);`
- Mobile: hamburger menu with smooth dropdown
- Active link indicator with blue underline

### 3.2 — Hero Section
Full-width, visually rich section:

**Layout:** Two-column on desktop (text left, visual right), stacked on mobile

**Left Content:**
- Eyebrow badge: `🤖 AI-Powered Lead Discovery` (pill badge, blue border)
- H1 headline: "Find Your Perfect B2B Leads with the Power of AI" — large, bold, display font
- Subheadline: "NovaLead transforms plain English into a targeted list of decision-makers. Describe who you need — we'll find them in seconds with verified contact data."
- CTA buttons row:
  - Primary: "Get Started Free →" (blue, large)
  - Secondary: "▶ Watch Demo" (outlined, with play icon)
- Trust bar below buttons: "Trusted by 10,000+ teams at Stripe, Notion, HubSpot, Zapier, and Atlassian"
- Social proof avatars: 5 overlapping circular avatars + "★★★★★ 4.9/5 from 2,000+ reviews"

**Right Content (Visual):**
- Floating UI mockup card showing a mini version of the search dashboard
- Card should show: search input with "Find 10 founders of Series A startups in US", a results table with 3-4 rows (Name, Title, Company, LinkedIn), and an "Export CSV" button
- Animate with subtle float: `animation: float 4s ease-in-out infinite;`
- Add decorative blobs/gradient circles in background (#2563EB with 10% opacity)

**Stats Row (below hero):**
- 3 stats in a row with dividers:
  - `10,000+` Active Users
  - `2M+` Leads Discovered
  - `95%` Accuracy Rate

### 3.3 — Social Proof / Logos Bar
- "TRUSTED BY LEADING COMPANIES" label
- Company logo row: Stripe, Notion, HubSpot, Zapier, Atlassian (use their actual SVG logos or styled text representations)
- Grayscale logos that colorize on hover

### 3.4 — Features Section
Grid layout of 6 feature cards:

**Section header:**
- Eyebrow: "Features"
- H2: "Everything You Need to Find Leads"
- Subtext: "Powerful AI-driven tools to discover, qualify, and manage your sales pipeline"

**6 Feature Cards** (3x2 grid desktop, 2x3 tablet, 1x6 mobile):
Each card has: colored icon, title, description

1. 🔍 **AI-Powered Search** — Describe your ideal prospect in plain English. Our AI understands context and finds exact matches.
2. 🎯 **Precision Targeting** — Filter by role, industry, company size, and location for laser-focused results.
3. ⚡ **Instant Results** — Get a targeted list of B2B decision-makers in under 10 seconds.
4. 💳 **Credit-Based Access** — Start with free credits. Scale as your pipeline grows with transparent pricing.
5. 📋 **Search History** — Review, reuse, and refine all your previous searches from one place.
6. 🔗 **LinkedIn-Ready** — Every lead comes with verified LinkedIn profile and company page links.

Card style: white background, subtle border, `border-radius: 16px`, icon in colored square bg, hover: lift shadow + border turns blue

### 3.5 — How It Works Section
Dark section (`background: #0F172A`)

**Header:**
- Eyebrow: "How It Works"
- H2: "Start Finding Leads in Minutes" (white text)
- Subtext: "Three simple steps to transform your lead generation" (muted text)

**3 Steps** (horizontal stepper on desktop, vertical on mobile):
Each with: step number circle, title, description, connecting line between steps

1. **Describe Your Ideal Lead** — Tell us the job titles, industries, company size, and locations you're targeting.
2. **AI Discovers Matches** — Our AI scans millions of verified profiles to find your perfect-fit leads instantly.
3. **Export & Engage** — Review results, export to CSV, or push directly to your CRM and start outreach.

Add a large illustrated mockup or screenshot preview below the steps showing the actual search UI

### 3.6 — CTA Banner Section
- Full-width gradient banner: `background: linear-gradient(135deg, #1D4ED8, #2563EB, #3B82F6)`
- H2: "Ready to Transform Your Lead Generation?"
- Subtext: "Join 10,000+ sales teams discovering qualified leads with AI. Start free — no credit card required."
- Two buttons: "Get Started Free" (white, blue text) + "Schedule Demo" (outlined white)
- Three trust icons below: ✅ Free forever | ✅ No credit card required | ✅ Cancel anytime

### 3.7 — Pricing Section
**Header:**
- Eyebrow: "Pricing"
- H2: "Free Forever"
- Subtext: "Full access to every feature. No credit card, no hidden fees, no catches."

**Single pricing card** (centered, prominent):
- Badge: "FREE FOREVER"
- Price: `$0/forever`
- Subtext: "Everything you need to find and manage leads"
- CTA: "Get Started Free"
- Feature list with checkmarks (8 items):
  - AI-powered lead discovery
  - Verified emails & phone numbers
  - LinkedIn profile matching
  - Company intelligence data
  - Advanced search filters
  - CSV export
  - Campaign analytics
  - Unlimited searches
- Bottom note: "No credit card required. No hidden fees."

Card style: white, prominent shadow, `border: 2px solid #2563EB`, popular badge

### 3.8 — Footer
Three-column layout:

**Col 1:** Logo + tagline + social icons (Twitter, LinkedIn, GitHub)
**Col 2:** Product links (Features, Pricing, Integrations, API, Changelog)
**Col 3:** Company links (About, Blog, Careers, Press, Contact)
**Col 4:** Resources (Documentation, Help Center, Community, Privacy Policy, Terms)

Bottom bar: "© 2026 NovaLead. All rights reserved." + Privacy | Terms

---

## 🔐 STEP 4 — AUTH PAGES (Login & Register)

### Login Page `/login`
- Centered card layout, max-width 420px
- Left side (desktop): decorative gradient panel with logo, tagline, and testimonial quote
- Right side: form
  - NovaLead logo + "Welcome back"
  - Subtitle: "Sign in to your account"
  - Email input (icon + label)
  - Password input (icon + show/hide toggle)
  - "Forgot password?" link right-aligned
  - "Sign In" primary button (full width)
  - Divider: "or"
  - "Continue with Google" button (with Google icon)
  - Footer: "Don't have an account? Sign up"
- Keep ALL existing form submission and auth logic intact

### Register Page `/register`
- Same split layout as login
- Form fields: Full Name, Email, Password, Confirm Password
- "Create Account" button
- Terms agreement checkbox
- "Already have an account? Sign in"
- Keep ALL existing registration logic intact

---

## 📊 STEP 5 — DASHBOARD LAYOUT (Authenticated)

The dashboard uses a **persistent sidebar + top header + main content** layout. Match the design from the screenshot.

### Sidebar (Left, Fixed)
- Width: 240px desktop, collapsible on mobile
- Background: `#0F172A` (dark navy)
- Top: NovaLead logo + "AI Prospecting CRM" subtitle (white)
- Nav items with icons:
  - 🏠 Dashboard
  - 🔍 New Search (active state: blue background pill)
  - 🕐 Search History
  - 💳 Credits
  - ⚙️ Settings
- Each item: icon + label, hover state, active state with `background: rgba(37,99,235,0.2); color: #2563EB; border-right: 3px solid #2563EB`
- Bottom: User info card (avatar initials circle + email + Logout button)

### Top Header
- Height: 60px, white background, bottom border
- Page title (dynamic per page)
- Right: Credits badge (`9 Credits` — pill with blue bg) + User avatar initials

### Main Content Area
- Background: `#F8FAFC`
- Padding: 24px
- Max width: 100% with responsive padding

---

## 🔍 STEP 6 — NEW SEARCH PAGE `/dashboard/search`

Keep ALL existing search functionality. Only improve visual design.

### Search Card
- White card, `border-radius: 16px`, `box-shadow: var(--shadow-md)`
- Header row: "Lead Discovery Engine" title (left) + Credits badge (right)
- Textarea input:
  - Placeholder: "Describe your ideal prospect... e.g. 'Find 10 founders of Series A startups in the US'"
  - Min-height: 100px, `border-radius: 10px`, focus: blue border + glow
  - Bottom-right: character count + AI model icons
- Info row: "● AI-Optimized Search · 1 Credit per batch" (muted text, left) + "Launch Prospector" button (right, blue, with search icon)

### Results Section
- Section header: "Results" + "Export CSV" button (outlined, right-aligned)
- Status bar (when results exist): cache status badges (Cache Miss/Hit | Strategy | Charged | Cache ID)
- Data table:
  - Clean white card with border
  - Columns: Name | Title | LinkedIn | Company | Company LI | Website
  - Rows: alternating white/gray-50 background
  - Hover: row highlights in blue-50
  - LinkedIn/Profile links: blue text with external link icon
  - Website links: with favicon or globe icon
  - Name: bold, avatar circle with initials (colored)
- Empty state: illustrated empty state with "No results yet. Launch a search above." message
- Loading state: skeleton loader rows

---

## 📅 STEP 7 — SEARCH HISTORY PAGE `/dashboard/history`

- Page header: "Search History" + subtitle "Review and reuse your previous searches"
- Filter/search bar at top
- History cards grid or list:
  - Each card: query text (truncated), date/time, credit cost badge, "Re-run Search" button, results count badge
  - Hover: lift + border blue
- Empty state: "No searches yet. Start your first search!" with CTA button
- Keep ALL existing history fetching logic

---

## 💳 STEP 8 — CREDITS PAGE `/dashboard/credits`

- Page header with current balance prominently displayed (large number, blue)
- Credit balance card: big number + "Credits Remaining" + circular progress or visual indicator
- Usage history table: Date | Search Query | Credits Used
- "Get More Credits" CTA section (even if free — show upgrade options)
- Keep ALL existing credits API calls

---

## ⚙️ STEP 9 — SETTINGS PAGE `/dashboard/settings`

- Clean sections with headers:
  - Profile: Name, Email fields
  - Security: Change Password
  - Preferences: Notifications toggle
  - Danger Zone: Delete Account (red section)
- Each section in its own card
- Save buttons per section
- Keep ALL existing settings save logic

---

## 📱 STEP 10 — RESPONSIVE DESIGN RULES

```
Mobile (< 640px):
- Sidebar: hidden by default, slide-in drawer with overlay
- Hamburger menu in top header
- Hero: single column, smaller text
- Feature grid: 1 column
- Table: horizontal scroll

Tablet (640px - 1024px):
- Sidebar: icons-only collapsed (48px wide)
- Hero: single column, medium text
- Feature grid: 2 columns

Desktop (> 1024px):
- Sidebar: fully expanded (240px)
- Hero: two columns
- Feature grid: 3 columns
```

---

## ✨ STEP 11 — ANIMATIONS & MICRO-INTERACTIONS

```css
/* Page transitions */
.page-enter { opacity: 0; transform: translateY(8px); }
.page-enter-active { opacity: 1; transform: translateY(0); transition: 300ms ease; }

/* Card hover */
.card { transition: transform 200ms ease, box-shadow 200ms ease; }
.card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

/* Button interactions */
.btn-primary { transition: all 150ms ease; }
.btn-primary:hover { background: var(--color-primary-dark); box-shadow: var(--shadow-blue); }
.btn-primary:active { transform: scale(0.98); }

/* Sidebar nav items */
.nav-item { transition: background 150ms ease, color 150ms ease; }

/* Hero float animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

/* Stats counter */
/* Use CountUp.js or intersection observer to animate numbers on scroll */

/* Table row hover */
.table-row { transition: background 100ms ease; }
.table-row:hover { background: #EFF6FF; }
```

---

## 🧩 STEP 12 — COMPONENT SPECIFICATIONS

### Primary Button
```
Background: #2563EB
Text: white, font-weight: 600
Padding: 10px 20px
Border-radius: 8px
Hover: #1D4ED8 + shadow
Active: scale(0.98)
Disabled: opacity 0.5
```

### Ghost/Outline Button
```
Background: transparent
Border: 1.5px solid #E2E8F0
Text: #0F172A
Hover: background #F8FAFC, border #2563EB
```

### Input Fields
```
Border: 1.5px solid #E2E8F0
Border-radius: 8px
Padding: 10px 14px
Focus: border #2563EB, box-shadow: 0 0 0 3px rgba(37,99,235,0.1)
Background: white
```

### Badge/Pill
```
Padding: 4px 10px
Border-radius: 9999px
Font-size: 0.75rem, font-weight: 600
Colors: blue (primary), green (success), amber (warning), gray (neutral)
```

### Data Table
```
Header: background #F8FAFC, font-weight: 600, text-transform: uppercase, font-size: 0.75rem, color: #64748B
Row: white background, border-bottom: 1px solid #F1F5F9
Row hover: background #EFF6FF
Cell padding: 12px 16px
```

---

## 🔧 TECHNICAL REQUIREMENTS

- Framework: React (keep existing)
- Styling: Tailwind CSS preferred, or CSS modules
- Icons: Lucide React (already likely installed) — use consistently
- Fonts: Add to index.html: `Plus Jakarta Sans` + `DM Sans` from Google Fonts
- No new npm packages unless absolutely necessary
- All interactive states: hover, focus, active, disabled, loading
- Accessibility: proper aria-labels, focus rings, color contrast ratios

---

## ✅ FINAL CHECKLIST

Before finishing, verify:
- [ ] All existing routes still work
- [ ] Login/Register form submission works
- [ ] Search API still fires correctly
- [ ] CSV export still works
- [ ] Credits count updates correctly
- [ ] Search history loads properly
- [ ] Sidebar navigation highlights correct active page
- [ ] Mobile hamburger menu works
- [ ] No console errors
- [ ] All loading and empty states are implemented
- [ ] Dark sidebar contrasts well with light main content

---

*End of Prompt — This prompt is for frontend UI redesign only. All backend functionality must remain unchanged.*
