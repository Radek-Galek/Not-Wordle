import type { LetterStatus } from "./evaluate";
import type { Lang } from "./i18n";
import { UI } from "./i18n";
import { foldWord } from "./words";

/**
 * Official-style hard mode: greens stay put, yellows must be reused somewhere.
 * Polish compares diacritic-insensitively (same as tile colours).
 */
export function isHardModeCompliant(
  guess: string,
  previousGuesses: string[],
  previousEvals: LetterStatus[][],
  lang: Lang,
): { ok: true } | { ok: false; reason: string } {
  if (previousGuesses.length === 0) return { ok: true };

  const t = UI[lang];
  const norm = (w: string) =>
    lang === "pl" ? [...foldWord(w, "pl")] : [...w.toLocaleLowerCase(lang)];
  const g = norm(guess);

  for (let row = 0; row < previousGuesses.length; row++) {
    const prev = norm(previousGuesses[row]);
    const ev = previousEvals[row];

    for (let i = 0; i < 5; i++) {
      if (ev[i] === "correct" && g[i] !== prev[i]) {
        return {
          ok: false,
          reason: t.hardMustStay(prev[i].toLocaleUpperCase(lang), i + 1),
        };
      }
    }
  }

  for (let row = 0; row < previousGuesses.length; row++) {
    const prev = norm(previousGuesses[row]);
    const ev = previousEvals[row];
    const used = g.map(() => false);

    for (let i = 0; i < 5; i++) {
      if (ev[i] !== "correct") continue;
      for (let j = 0; j < 5; j++) {
        if (!used[j] && g[j] === prev[i]) {
          used[j] = true;
          break;
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      if (ev[i] !== "present") continue;
      let found = false;
      for (let j = 0; j < 5; j++) {
        if (!used[j] && g[j] === prev[i]) {
          used[j] = true;
          found = true;
          break;
        }
      }
      if (!found) {
        return {
          ok: false,
          reason: t.hardMustUse(prev[i].toLocaleUpperCase(lang)),
        };
      }
    }
  }

  return { ok: true };
}
