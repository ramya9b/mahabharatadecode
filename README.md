# MahabharataDecoded

AI-powered Mahabharata storytelling website. Features articles, character profiles, quiz, daily wisdom, and the **Story Teller** — an AI narrator powered by Gemini.

## 🚀 Deployed on Cloudflare Pages

Live at: [mahabharatadecoded.com](https://mahabharatadecoded.com)

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Add your Gemini API key
cp .env.example .env
# Edit .env → add VITE_GEMINI_API_KEY

# Run locally
npm run dev
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Preview deploy
npm run deploy:preview
```

See **CLOUDFLARE_DEPLOY.md** for full deployment guide.

## 🛠 Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui
- React Router DOM
- i18next (English, Telugu, Hindi, Kannada)
- Gemini API (Story Teller)
- Cloudflare Pages (hosting)

## 📁 Key Files

| File | Purpose |
|---|---|
| `src/pages/StoryTeller.tsx` | AI Story Teller page |
| `src/data/storyCharacters.ts` | 25 Mahabharata characters |
| `src/services/gemini.ts` | Gemini API integration |
| `public/_redirects` | Cloudflare SPA routing |
| `public/_headers` | Cloudflare security headers |
| `wrangler.toml` | Cloudflare project config |
