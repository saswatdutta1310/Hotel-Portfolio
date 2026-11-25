# Hotel_Saswat

SEO-first portfolio websites for hotels and guest houses. Guests find a hotel
through search, see everything about the stay, and contact the owner by call,
WhatsApp or email. No booking and no payments.

- `frontend/` Next.js website (port 3000)
- `backend/` Express API (port 4000)
- `docs/` shared documentation; `docs/api-contract.md` is the source of truth

## Structure

    Hotel_Saswat/
    |-- README.md, AGENTS.md, .gitignore, .editorconfig
    |-- .github/workflows/ci.yml
    |-- docs/            architecture, api-contract, onboarding-checklist, seo-checklist
    |-- frontend/        Next.js: src/app, src/components, src/lib, public/hotels/<slug>
    `-- backend/         Express: src/{routes,services,schemas,middleware,config},
                         data/hotels, scripts, tests

## Working rules
See AGENTS.md. Everything is committed to the main branch only.
