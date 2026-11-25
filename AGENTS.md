# AGENTS.md: rules for every Antigravity session

Project: hotel-portfolio. SEO-first portfolio websites for hotels and guest
houses. Travellers find a hotel through Google, see everything, and contact the
owner by call, WhatsApp or email. NO booking and NO payments. The built-in demos
are fictional (sample-hotel, sample-guesthouse). Never use a real business's
name, photos or text.

## Layout
- frontend/  Next.js (latest stable, App Router), React, TypeScript, Tailwind v4,
             shadcn/ui, pnpm. Port 3000.
- backend/   Node + Express + TypeScript, Zod, Vitest, pnpm. Port 4000.
- docs/      Shared docs. docs/api-contract.md is the source of truth for data
             shapes and endpoints. Do not change it from a frontend or backend
             session; tell the user if it needs to change.
- Each app has its own package.json. There is no root workspace.

## Code rules
- Strict TypeScript, no `any`. Validate all input with Zod.
- No hotel-specific values hard-coded in components or routes. Everything comes
  from the hotel data.
- Unknown hotel values are the string "TODO" (strings) or null (numbers).
- Never commit secrets. Only .env.example is committed.
- Mobile first (390px). Visible keyboard focus. Semantic HTML. Alt text.
- Until the design phase: plain styling, system fonts, neutral colors, all
  colors and fonts through CSS variables.

## Git rules
- Work ONLY on the main branch. Never create or switch branches. Never merge.
- Windows PowerShell 5: never chain commands with && or ||. One command per line.
- Commit ONLY your own folder: `git add frontend` or `git add backend`.
  Never use `git add -A` or `git add .`.
- After each task run lint, typecheck, test and build in your app. Only if all
  pass: git status (confirm no .env or key is staged), git add <your folder>,
  git commit -m "<message>", git pull --rebase origin main, git push origin main.
- Never use git push --force.
- After each push, report the commit hash and a one-line summary.
