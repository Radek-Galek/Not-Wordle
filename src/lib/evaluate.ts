import type { Lang } from "./i18n";
import { foldLetter, foldWord } from "./words";

export type LetterStatus = "correct" | "present" | "absent";

/**
 * Wordle-accurate evaluation (handles duplicate letters correctly).
 * Polish: compares diacritic-insensitively (n/ń, a/ą, …) because the
 * on-screen keyboard only has ASCII keys.
 */
export function evaluateGuess(
  guess: string,
  answer: string,
  lang: Lang = "en",
): LetterStatus[] {
  const g =
    lang === "pl"
      ? [...foldWord(guess, "pl")]
      : [...guess.toLocaleLowerCase(lang)];
  const a =
    lang === "pl"
      ? [...foldWord(answer, "pl")]
      : [...answer.toLocaleLowerCase(lang)];

  const result: LetterStatus[] = Array(5).fill("absent");
  const remaining = [...a];

  for (let i = 0; i < 5; i++) {
    if (g[i] === a[i]) {
      result[i] = "correct";
      remaining[i] = "";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const idx = remaining.indexOf(g[i]);
    if (idx !== -1) {
      result[i] = "present";
      remaining[idx] = "";
    }
  }

  return result;
}

export function mergeKeyStatuses(
  current: Record<string, LetterStatus>,
  guess: string,
  statuses: LetterStatus[],
  lang: Lang = "en",
): Record<string, LetterStatus> {
  const rank: Record<LetterStatus, number> = {
    absent: 0,
    present: 1,
    correct: 2,
  };
  const next = { ...current };
  const letters = [...guess.toLocaleLowerCase(lang)];

  const apply = (letter: string, status: LetterStatus) => {
    if (!next[letter] || rank[status] > rank[next[letter]]) {
      next[letter] = status;
    }
  };

  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    const status = statuses[i];
    // Polish: only colour ASCII keys (ń → n), matching folded evaluation
    const key = foldLetter(letter, lang);
    apply(key, status);
  }
  return next;
}
