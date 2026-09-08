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

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Deploy — framework preset is Next.js; no env vars needed

Or from the CLI:

```bash
npx vercel
```

## Play

- **Classic** — standard six-guess Wordle
- **Coach** — show up to 10 random words that still fit your green/yellow/gray clues (answer not guaranteed). Tap a hint to fill the row; shuffle for another batch
- **Hard** — must reuse revealed greens and yellows

Type with your keyboard or tap the on-screen keys. **New game** when you finish.
