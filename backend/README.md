# Hotel Saswat Backend

Node + Express + TypeScript REST API powering the hotel and guest house portfolio platform.

## Features
- **Strict TypeScript** with zero `any` types
- **Zod schemas** matching the shared API contract (`docs/api-contract.md`)
- **JSON File-backed Store** for hotel and guest house properties
- **CORS & Security** via Helmet and whitelist-based CORS
- **Structured Error Handling** conforming to `{ "error": { "code": "...", "message": "..." } }`
- **Automated Validation & Scaffolding** CLI scripts

---

## Prerequisites
- Node.js (v20+ recommended)
- pnpm (v9+ or v12+)
- Windows PowerShell 5+

---

## Setup & Installation

From the `backend/` directory in Windows PowerShell:

1. Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

2. Install dependencies:
```powershell
pnpm install
```

3. If prompted by pnpm for native builds (e.g. `esbuild`):
```powershell
pnpm approve-builds --all
```

---

## Running the Application

### Development (watch mode with tsx on port 4000)
```powershell
pnpm run dev
```

### Production Build & Run
```powershell
pnpm run build
pnpm start
```

---

## Quality Checks & Testing

Run each command separately in PowerShell:

```powershell
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run validate:hotels
```

---

## Utility Scripts

### Validate Hotel JSON Files
Validates every JSON in `data/hotels/` against the Zod schema, checks kebab-case slug uniqueness and filename parity:
```powershell
pnpm run validate:hotels
```

### Scaffold a New Hotel Property
Creates a new JSON file initialized from `_template.json` under `data/hotels/<slug>.json`:
```powershell
pnpm run new:hotel <slug>
```
*Example:*
```powershell
pnpm run new:hotel sea-breeze-resort
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Healthcheck returning `{ "status": "ok" }` |
| `GET` | `/api/hotels` | Returns `{ "hotels": HotelSummary[] }` |
| `GET` | `/api/hotels/:slug` | Returns detailed `Hotel` object or 404 error |
