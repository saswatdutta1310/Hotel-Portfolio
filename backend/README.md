# Hotel Saswat Backend

Node + Express + TypeScript REST API powering the hotel and guest house portfolio platform.

## Features
- **Strict TypeScript** with zero `any` types
- **Zod schemas** matching the shared API contract (`docs/api-contract.md`)
- **JSON File-backed Store** for hotel and guest house properties
- **Reverse Proxy Ready**:
  - `TRUST_PROXY` configuration (`app.set("trust proxy", ...)`) for accurate visitor IP resolution behind reverse proxies/CDNs.
- **Enquiry Endpoint (`POST /api/enquiry`)**:
  - Validates contact, stay dates, guest count, and hotel existence
  - Trims strings and rejects control characters
  - Honeypot spam defense (hidden `website` field returns 200 without sending email)
  - Rate limiting via `express-rate-limit` (5 requests/IP/hour returning 429)
  - Request body size limit enforced at 10kb (returning 413)
- **Nodemailer Email Service**:
  - Configurable modes (`EMAIL_MODE=console` or `smtp`)
  - Full HTML escaping on all user-supplied values
  - Header injection prevention (user input excluded from headers and subject templates)
  - Privacy compliance: never logs personal information (names, emails, phone numbers, messages)
- **CORS & Security**:
  - Comma-separated allowed origins with fail-fast validation in production mode (forbids empty origin or wildcard `*`)
  - Helmet security headers
  - Safe production error responses with no internal stack trace exposure
- **Graceful Shutdown**:
  - Catches `SIGTERM` and `SIGINT` signals, halts new connections, finishes in-flight requests, and cleanly exits
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

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | API server port | `4000` |
| `ALLOWED_ORIGIN` | Comma-separated list of allowed frontend origins (in production, cannot be empty or `*`) | `http://localhost:3000` |
| `TRUST_PROXY` | Number of upstream proxy hops (e.g. `1` behind Nginx/Render/Cloudflare, `0` direct). **Warning:** A wrong value can allow visitors to spoof their IP address. | `0` |
| `EMAIL_MODE` | Email delivery strategy: `console` or `smtp` | `console` |
| `SMTP_HOST` | SMTP server host | `localhost` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | `TODO` |
| `SMTP_PASS` | SMTP password | `TODO` |
| `MAIL_FROM` | Sender email address | `no-reply@hotelportfolio.local` |
| `DEFAULT_ENQUIRY_TO` | Fallback recipient when hotel contact email is `TODO` | `reservations@hotelportfolio.local` |

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
| `POST` | `/api/enquiry` | Submits enquiry email for hotel, protected by rate limiting and honeypot |
