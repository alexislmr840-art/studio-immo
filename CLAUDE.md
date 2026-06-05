@AGENTS.md

# Studio Immo — Codebase Guide

## Project overview

Studio Immo is a French-language SaaS for real estate agents. It takes a property listing (title, city, price, surface, description, photos, agency branding) and uses OpenAI GPT-4o-mini to generate a 5-campaign social-media strategy (Facebook posts, Instagram captions, Stories, visual ideas) plus downloadable PNG visuals rendered on an HTML5 Canvas.

The app has no database and no authentication system yet — state is passed between pages via `localStorage` and `sessionStorage`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` syntax — not v3) |
| AI | OpenAI SDK v6 (`gpt-4o-mini`, JSON mode) |
| Image generation | HTML5 Canvas API (no server-side rendering) |
| Font | Geist Sans only (from `next/font/google`) |

## File structure

```
app/
  layout.tsx            — Root layout: Geist font, metadata, html/body shell
  globals.css           — Tailwind v4 import + CSS custom properties
  page.tsx              — Landing page (static, no auth)
  connexion/page.tsx    — Login form UI (no backend yet)
  dashboard/page.tsx    — Dashboard UI (hardcoded zeroes, no auth yet)
  nouveau-bien/page.tsx — Property intake form ("use client")
  resultats/page.tsx    — Results page: AI copy + canvas visual download ("use client")
  api/
    generate/route.ts   — POST /api/generate — calls OpenAI, returns JSON strategy
public/                 — Static SVG assets (Next.js defaults)
next.config.ts          — Empty Next.js config
tsconfig.json           — Strict TS, path alias @/* → ./*
eslint.config.mjs       — next/core-web-vitals + next/typescript (ESLint v9 flat config)
postcss.config.mjs      — @tailwindcss/postcss plugin (Tailwind v4)
```

## Routing (App Router)

All routes use the Next.js App Router file-system convention:

| URL | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Server component |
| `/connexion` | `app/connexion/page.tsx` | Server component (form is static) |
| `/dashboard` | `app/dashboard/page.tsx` | Server component |
| `/nouveau-bien` | `app/nouveau-bien/page.tsx` | Client component (`"use client"`) |
| `/resultats` | `app/resultats/page.tsx` | Client component (`"use client"`) |
| `POST /api/generate` | `app/api/generate/route.ts` | Route Handler |

## Data flow

```
/nouveau-bien (form)
  → POST /api/generate (OpenAI call)
  → localStorage: studio_immo_resultat, studio_immo_bien, studio_immo_agence, studio_immo_photo_principale
  → sessionStorage: studio_immo_photos, studio_immo_logo   ← photos kept here to avoid localStorage 5 MB quota
  → window.location.href = "/resultats"

/resultats (display)
  ← reads all keys above from storage
  → canvas API renders 1080×1350 px PNG for download
```

**Critical storage split:** Photos (base64 data URLs) go to `sessionStorage` only. Text data goes to `localStorage`. Never put photo data in `localStorage` — the quota will be exceeded immediately.

## OpenAI API contract

Route: `POST /api/generate`

Request body:
```json
{ "titre": "", "ville": "", "prix": "", "surface": "", "description": "" }
```

Response (JSON mode — no markdown wrapping):
```json
{
  "profilAcheteur": "string",
  "pointsForts": ["string", "string", "string", "string"],
  "strategie": "string",
  "publications": [
    {
      "titre": "", "objectif": "", "reseau": "", "jourPublication": "",
      "accroche": "", "facebook": "", "instagram": "", "story": "",
      "ideeVisuelA": "", "ideeVisuelB": ""
    }
  ]
}
```

Always exactly 5 publications. The model is `gpt-4o-mini` with `response_format: { type: "json_object" }`.

Required env var: `OPENAI_API_KEY`

## Canvas visual generation

`telechargerVisuel()` in `resultats/page.tsx` renders a 1080×1350 px PNG:
- Header bar (blue-950): agency logo or name + badge ("Nouveau bien" / "Coup de cœur")
- Main photo: `drawCover()` — object-fit cover logic
- Grid of up to 3 secondary photos
- Accroche text: `wrapText()` with `maxLines` truncation + ellipsis
- Footer row: city, surface, price (only if `afficherPrix` is true), phone
- Two variants: A (blue-950 header) and B (slate-950 header)

`loadImage()` returns a Promise so all images resolve before drawing.

## Key UI conventions

- **Color palette**: `blue-950` (primary dark), `amber-400`/`amber-500` (accent), `slate-*` (neutral), white backgrounds for cards
- **Rounded corners**: `rounded-xl` for inputs/buttons, `rounded-2xl`/`rounded-3xl` for cards
- **All text is French** — keep all user-facing strings in French
- **No component library** — everything is hand-written Tailwind
- Buttons use `disabled:opacity-70` during loading states; show French loading text
- Copy-to-clipboard gives visual `"✅ Copié !"` feedback for 2 s (no `alert()`)

## Tailwind v4 specifics

This project uses Tailwind v4, which differs significantly from v3:

- CSS entry point is `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- Custom theme tokens use `@theme inline { ... }` block in CSS
- PostCSS plugin is `@tailwindcss/postcss` (not `tailwindcss`)
- No `tailwind.config.js` — configuration lives in `globals.css`

## Development commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (flat config, v9)
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4o-mini |

Create a `.env.local` file at the repo root (never commit it).

## What does NOT exist yet

- Authentication / session management (login form is UI-only)
- Database (no persistence beyond browser storage)
- User accounts or multi-tenancy
- Server-side image handling
- Tests of any kind
- `components/` directory — no shared components yet

When adding features that need persistence, plan for a database integration. When adding shared UI, create a `components/` directory at the repo root.
