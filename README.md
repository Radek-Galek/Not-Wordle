# Endless

Unlimited Wordle — no ads, no daily limit. Built with Next.js for Vercel.

## Word lists

Bundled locally (no external API):

| Language | Answers | Valid guesses |
|----------|---------|---------------|
| English  | ~1,475 (common words only) | ~13k |
| Polish   | ~1,550 (common lemmas; no niema-style junk / plurals) | ~30k |

Polish answers drop declined forms (aferą / afery / akcje etc.). You can still type ASCII without diacritics.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Extra English words

Add custom 5-letter English words via env (comma-separated):

```bash
EN_EXTRA_WORDS=poopy,bitch,faggy
```

Copy `.env.example` → `.env.local` for local use.

**On Vercel:** Project → Settings → Environment Variables → add `EN_EXTRA_WORDS` for Production (and Preview if you want) → **Redeploy**. The game loads extras from `/api/extra-words` at runtime, so they work as guesses even when not baked into the client bundle.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set `EN_EXTRA_WORDS` if you want extras (e.g. `poopy,bitch,faggy`)
4. Deploy — framework preset is Next.js

Or from the CLI:

```bash
npx vercel
```

## Play

- **Classic** — standard six-guess Wordle
- **Coach** — show up to 10 random words that still fit your green/yellow/gray clues (answer not guaranteed). Tap a hint to fill the row; shuffle for another batch
- **Hard** — must reuse revealed greens and yellows

Type with your keyboard or tap the on-screen keys. **New game** when you finish.
