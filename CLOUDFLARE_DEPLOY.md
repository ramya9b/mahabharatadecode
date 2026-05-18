# 🚀 Deploy to Cloudflare Pages — Step-by-Step Guide

## Prerequisites
- GitHub account (free)
- Cloudflare account (free) — cloudflare.com
- Gemini API key (free) — ai.google.dev

---

## Method 1 — Cloudflare Dashboard (Recommended for first deploy)

### Step 1 — Push code to GitHub
```bash
git init
git add .
git commit -m "feat: add Story Teller page"
git remote add origin https://github.com/YOUR_USERNAME/mahabharatadecoded.git
git push -u origin main
```

### Step 2 — Connect to Cloudflare Pages
1. Go to dash.cloudflare.com
2. Click **Pages** in the left sidebar
3. Click **Create a project** → **Connect to Git**
4. Select your GitHub account → select `mahabharatadecoded` repo
5. Click **Begin setup**

### Step 3 — Configure Build Settings
| Setting | Value |
|---|---|
| Project name | `mahabharatadecoded` |
| Production branch | `main` |
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `18` (set in Environment variables as `NODE_VERSION = 18`) |

### Step 4 — Add Environment Variables
Still in the setup screen, scroll to **Environment variables**:

| Variable | Value | Environment |
|---|---|---|
| `VITE_GEMINI_API_KEY` | your_gemini_key | Production |
| `VITE_GEMINI_API_KEY` | your_gemini_key | Preview |
| `NODE_VERSION` | `18` | Production |

### Step 5 — Deploy
Click **Save and Deploy** → wait ~2 minutes → your site is live!

Cloudflare gives you a free URL like:
`https://mahabharatadecoded.pages.dev`

---

## Step 6 — Add Custom Domain (mahabharatadecoded.com)
1. In your Pages project → **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter `mahabharatadecoded.com`
4. Cloudflare will auto-configure DNS (since domain is already on Cloudflare)
5. Done — SSL is automatic and free

---

## Method 2 — Wrangler CLI (For updates after first deploy)

### Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### Deploy
```bash
npm run build
npm run deploy
# = wrangler pages deploy dist --project-name=mahabharatadecoded
```

### Preview deploy (test before going live)
```bash
npm run deploy:preview
```

---

## Local Development with Cloudflare Wrangler
```bash
# Test exactly as Cloudflare will serve it
npm run build
npm run cf:dev
# Opens at http://localhost:8788
```

---

## Environment Variables — After First Deploy

To update `VITE_GEMINI_API_KEY` later:
1. dash.cloudflare.com → Pages → mahabharatadecoded
2. **Settings** → **Environment variables**
3. **Edit** → update value → **Save**
4. **Deployments** → **Retry deployment** (to rebuild with new key)

---

## What the Cloudflare Files Do

| File | Purpose |
|---|---|
| `public/_redirects` | Handles React Router — all URLs serve `index.html` |
| `public/_headers` | Security headers + asset caching rules |
| `wrangler.toml` | Cloudflare project config |
| `vite.config.ts` | Build optimisation — code splitting for fast CF edge serving |

---

## Troubleshooting

**Build fails with Node version error**
→ Add `NODE_VERSION = 18` as environment variable in Pages dashboard

**Routes give 404 on refresh**
→ Make sure `public/_redirects` file exists with `/* /index.html 200`

**Gemini API not working on production**
→ Check VITE_GEMINI_API_KEY is set in Pages → Settings → Environment variables
→ After adding, trigger a new deployment

**Custom domain not connecting**
→ Your domain must be managed by Cloudflare DNS (add site to Cloudflare first)

---

## Free Tier Limits (Cloudflare Pages)
- Unlimited requests
- Unlimited bandwidth  
- 500 builds/month
- Custom domains: unlimited
- All completely free 🎉
