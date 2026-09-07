import type { Lang } from "./i18n";
import { foldLetter } from "./words";

export type LetterStatus = "correct" | "present" | "absent";

/** Wordle-accurate evaluation (handles duplicate letters correctly). */
export function evaluateGuess(
  guess: string,
  answer: string,
  locale = "en",
): LetterStatus[] {
  const g = [...guess.toLocaleLowerCase(locale)];
  const a = [...answer.toLocaleLowerCase(locale)];
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
    apply(letter, status);
    // Polish keyboard has no diacritic keys — colour the ASCII twin too
    const folded = foldLetter(letter, lang);
    if (folded !== letter) apply(folded, status);
  }
  return next;
}
