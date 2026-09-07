import type { LetterStatus } from "./evaluate";
import { evaluateGuess } from "./evaluate";
import type { Lang } from "./i18n";
import { getAnswers } from "./words";

/** A word is still possible if every past guess would produce the same colors against it. */
export function getPossibleAnswers(
  lang: Lang,
  guesses: string[],
  evaluations: LetterStatus[][],
): string[] {
  if (guesses.length === 0) return getAnswers(lang);

  return getAnswers(lang).filter((candidate) =>
    guesses.every(
      (guess, i) =>
        evaluateGuess(guess, candidate, lang).join("") ===
        evaluations[i].join(""),
    ),
  );
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Up to `count` random remaining candidates. Answer is not forced in. */
export function sampleHints(
  lang: Lang,
  guesses: string[],
  evaluations: LetterStatus[][],
  count = 10,
): { words: string[]; remaining: number } {
  const guessed = new Set(guesses);
  const possible = getPossibleAnswers(lang, guesses, evaluations).filter(
    (w) => !guessed.has(w),
  );
  return {
    words: shuffle(possible).slice(0, count),
    remaining: possible.length,
  };
}
