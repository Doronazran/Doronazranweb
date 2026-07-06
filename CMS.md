# Content Backend (CMS) — Setup

The admin panel can now publish content that is live for **all visitors** (not
just your browser). The code is deployed; you just need to connect a database
and set the admin password on Vercel. One-time, ~3 minutes.

## How it works
- `GET /api/content` — public; the whole site loads published content from here.
- `POST /api/content` — admin only; saves content. The password is checked
  **on the server** (env var `ADMIN_PASSWORD`), so it is real security.
- Storage: **Upstash Redis / Vercel KV**.
- Locally (`npm run dev`) it uses a gitignored `.dev-content.json` file, so you
  can test without any cloud setup.

## One-time setup on Vercel

### 1. Create the database
1. Vercel → project **Doronazranweb** → **Storage** tab → **Create Database**.
2. Choose **Upstash for Redis** (a.k.a. KV) → create → **Connect** it to the project.
3. This automatically adds the env vars `KV_REST_API_URL` + `KV_REST_API_TOKEN`.

### 2. Set the admin password (server side)
Settings → **Environment Variables** → add:

| Key | Value | Notes |
|-----|-------|-------|
| `ADMIN_PASSWORD` | your real admin password | **Server-only.** This is the login + publish password on the live site. Not shipped to the browser. |

> Security tip: make `ADMIN_PASSWORD` a value **different** from `VITE_ADMIN_PASSWORD`
> (the UI-gate password, which IS visible in the page code). Then the real
> password never appears in the browser bundle. If you set them the same
> (`D@5299014`), publishing still works but the password is guessable.

### 3. Redeploy
Deployments → latest → ⋯ → **Redeploy** (or just wait for the next auto-sync push).

## Using it
1. Go to `https://<your-domain>/admin` → log in with `ADMIN_PASSWORD`.
2. Edit any text/field (all languages).
3. Click **⬆ פרסם לאתר** (Publish to site).
4. The change is now live for every visitor. Reload to confirm.

If publishing shows "backend not configured", the database (step 1) or
`ADMIN_PASSWORD` (step 2) is missing.

## Limits (Phase 1)
- Uploaded images are stored inline; large images can exceed the request limit.
  Prefer image **URLs** for big assets (a later phase can add Vercel Blob for
  file uploads).
