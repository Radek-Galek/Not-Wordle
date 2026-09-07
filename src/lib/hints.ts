import type { LetterStatus } from "./evaluate";
import { evaluateGuess } from "./evaluate";
import { getAnswers } from "./words";

/** A word is still possible if every past guess would produce the same colors against it. */
export function getPossibleAnswers(
  guesses: string[],
  evaluations: LetterStatus[][],
): string[] {
  if (guesses.length === 0) return getAnswers();

  return getAnswers().filter((candidate) =>
    guesses.every(
      (guess, i) =>
        evaluateGuess(guess, candidate).join("") === evaluations[i].join(""),
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
  guesses: string[],
  evaluations: LetterStatus[][],
  count = 10,
): { words: string[]; remaining: number } {
  const guessed = new Set(guesses.map((g) => g.toLowerCase()));
  const possible = getPossibleAnswers(guesses, evaluations).filter(
    (w) => !guessed.has(w),
  );
  return {
    words: shuffle(possible).slice(0, count),
    remaining: possible.length,
  };
}
