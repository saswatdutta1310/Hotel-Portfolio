# Hotel Portfolio Frontend

Next.js App Router frontend for SEO-first hotel and guest house portfolio websites.

## Tech Stack
- **Framework:** Next.js (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **Testing:** Vitest (unit tests) & Playwright (smoke & e2e)
- **Package Manager:** pnpm

---

## Getting Started (Windows PowerShell)

Ensure you run commands line by line (do not chain with `&&` or `||` in PowerShell 5).

### 1. Install Dependencies
```powershell
cd D:\Hotel_Saswat\frontend
pnpm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```powershell
Copy-Item .env.example .env.local
```

Default settings in `.env.example`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
USE_MOCK=true
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
NEXT_PUBLIC_ANALYTICS_DOMAIN=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

### 3. Switching Between Mock Data and Real Backend

- **Using Mock Data (Default):**
  Set `USE_MOCK=true` in `.env.local`. The frontend reads fictional hotel fixtures from `src/lib/fixtures/` (`sample-hotel.json` and `sample-guesthouse.json`). Client components like EnquiryForm simulate a short delay and success without sending network requests.

- **Using the Real Backend:**
  1. Ensure the Express backend is running on `http://localhost:4000`.
  2. Set `USE_MOCK=false` in `.env.local`:
     ```env
     USE_MOCK=false
     API_URL=http://localhost:4000
     NEXT_PUBLIC_API_URL=http://localhost:4000
     ```
  3. Client-side requests (such as the enquiry form `POST /api/enquiry`) will submit directly to `NEXT_PUBLIC_API_URL`.
  4. Restart the Next.js server so updated environment variables are loaded.

---

## Available Scripts

Run each command individually from the `frontend/` directory:

```powershell
# Start local development server on port 3000
pnpm dev

# Typecheck TypeScript code
pnpm typecheck

# Lint source code
pnpm lint

# Run Vitest unit tests
pnpm test

# Build production bundle
pnpm build

# Start production server on port 3000
pnpm start

# Run Playwright smoke tests
npx playwright test
```
