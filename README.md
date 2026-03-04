# dauzzie.dev

Personal website and writing hub for stories, poems, and career development.

- Framework: [Next.js](https://nextjs.org/) + [Contentlayer](https://www.contentlayer.dev/)
- Content format: MDX in `data/blog/`
- Styling: Tailwind CSS
- Companion app: SwiftUI writer tool in `macos/DauzzieWriter`

## Free Hosting Setup (GitHub + Vercel)

This stack is free for personal use and works with your current Next.js features.

1. Push this repo to GitHub
2. Create a Vercel account and import the GitHub repo
3. Add environment variables in Vercel (same values as `.env.local`)
4. Deploy

Once linked, every `git push` triggers an automatic Vercel deployment.

## 1) Local Website Setup

### Install prerequisites (macOS)

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc
fnm install 18
fnm use 18
corepack enable
corepack prepare yarn@1.22.22 --activate
```

### Install dependencies and run

```bash
cd /Users/dauzzie/Documents/GitHub/dauzziedev
yarn install
cp .env.example .env.local
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## 2) Password-Protected Access

Set these in `.env.local`:

```bash
SITE_PASSWORD=your-actual-password
SITE_ACCESS_TOKEN=long-random-token-value
```

- `SITE_PASSWORD` is what you enter on `/gate`
- `SITE_ACCESS_TOKEN` is the cookie token issued after login

When both env vars are set, middleware protects the site.

### Poetry-only password gate

Set these if you want only `/poetry` locked:

```bash
POETRY_PASSWORD=your-poetry-password
POETRY_ACCESS_TOKEN=another-long-random-token
```

- `/poetry` redirects to `/poetry/unlock` when cookie is missing
- `/blog` stays public
- Poetry posts are filtered by the `poetry` tag

## 3) Content Workflow

- Blog posts: `data/blog/*.mdx`
- Poetry posts: `data/blog/*.mdx` (tagged with `poetry`, shown under `/poetry`)
- About/career content: `data/authors/default.mdx`
- Site identity/slogan/socials: `data/siteMetadata.js`

Useful commands:

```bash
yarn lint
yarn build
yarn serve
```

## 4) macOS Companion App (DauzzieWriter)

The app creates MDX drafts in `data/blog/`, shows writing prompts, and helps jump into local editing quickly.

Run:

```bash
cd macos/DauzzieWriter
swift run
```

Open in Xcode:

```bash
cd macos/DauzzieWriter
open Package.swift
```

Install as a normal app in Applications:

```bash
cd macos/DauzzieWriter
./scripts/install-app.sh
```

The app includes:
- Draft creation (`Blog`, `Poem`)
- Git commit + push buttons
- Vercel deployment trigger button
- Deploy Hook and `VERCEL_TOKEN` settings

## 5) Recommended Tooling

- VS Code extensions: ESLint, Prettier, Tailwind CSS IntelliSense, MDX
- Image optimization: ImageOptim
- Product/design: Figma
- Deployment: Vercel
- Optional storage stack:
  - Supabase (DB + auth + storage)
  - Cloudinary (image storage/optimization)
  - Upstash Redis (caching, counters, lightweight analytics data)
