# DauzzieWriter (macOS companion app)

Local SwiftUI app to help you create and manage writing drafts for this website.

## Install as a real macOS app

```bash
cd macos/DauzzieWriter
./scripts/install-app.sh
```

This installs `DauzzieWriter.app` to `/Applications` (or `~/Applications` if needed).

## Run

```bash
cd macos/DauzzieWriter
swift run
```

## Open in Xcode

```bash
cd macos/DauzzieWriter
open Package.swift
```

## What it does

- Creates MDX drafts in `data/blog/` and `data/poetry/`
- Loads existing drafts for editing
- Saves modifications to existing drafts
- Deletes selected drafts
- Supports post type selection: `Journal`, `Poem`, `Music`, `Project`
- Shows a rotating daily writing prompt
- Lists latest draft files
- Syncs latest content from GitHub (`git fetch` + `git pull --ff-only`)
- Opens repo, local site, and latest draft quickly
- Commits and pushes content changes to GitHub
- Triggers deployment to Vercel (via Deploy Hook or Vercel CLI)
- One-click publish flow: create draft (optional) -> commit -> push -> deploy

## Recommended flow

1. Click `Sync`
2. `Open` an existing entry (or click `New`)
3. Write and click `Save Draft`
4. Click `Publish Live`

Delete flow:

1. Click trash icon next to an entry (or `Delete Current`)
2. Confirm in the delete dialog

Use `Advanced Publish Options` only when you need split control (`Commit + Push` or `Deploy Only`).

By default, `Publish Live` uses Git push and relies on Vercel's automatic Git deployment.
Disable the toggle in the app only if you want manual deploy calls from the app.

## Vercel deploy options in app

Use either:

1. `Deploy Hook URL` (recommended, no CLI dependency)
2. `VERCEL_TOKEN` + optional project name (uses `vercel --prod --yes`)

If your GitHub repo is connected to Vercel, the `Commit + Push (GitHub)` button also triggers auto deployment.
