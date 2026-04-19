# iron-ink-bridge-v1

Single-page React + Tailwind sample site for the Goffstown Homeowner Savings mailer.

## Run locally

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Build for production: `npm run build`

## Admin auth setup

The private `/admin` route uses Supabase Auth with Google sign-in.

1. Copy `.env.example` to `.env`
2. Fill in `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_ADMIN_EMAILS`
3. Optionally set `VITE_ADMIN_PASSWORD` for a demo-only fallback unlock. Do not treat this as real security because it ships in the client bundle.
4. In Supabase, enable the Google provider and add the exact admin callback URL you use locally and in production to the OAuth redirect allow list. For this repo, that means `http://127.0.0.1:5173/admin` or `http://localhost:5173/admin` during local development, plus your production `/admin` URL.
5. In Google Cloud, set the OAuth redirect URI to `https://ggxwgfgzferwholfkqaj.supabase.co/auth/v1/callback` for this project.
6. Visit `/admin` and sign in with one of the allowlisted email addresses, or use the demo password if you enabled it

## Behavior

- The hero town defaults to Goffstown.
- Override the displayed town with `?town=TownName`.
- Each offer section includes a lead-capture modal and a text-to-offer action.
- The `/admin` route is protected by Google OAuth and an email allowlist.
- Vercel uses a rewrite so direct visits to `/admin` load the SPA instead of 404ing.
- Mailer source assets live in [docs](docs), including the front, back, and PDF versions.
