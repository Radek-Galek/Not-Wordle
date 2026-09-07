export type LetterStatus = "correct" | "present" | "absent";

/** Wordle-accurate evaluation (handles duplicate letters correctly). */
export function evaluateGuess(
  guess: string,
  answer: string,
  locale = "en",
): LetterStatus[] {
  const g = guess.toLocaleLowerCase(locale).split("");
  const a = answer.toLocaleLowerCase(locale).split("");
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
  locale = "en",
): Record<string, LetterStatus> {
  const rank: Record<LetterStatus, number> = {
    absent: 0,
    present: 1,
    correct: 2,
  };
  const next = { ...current };
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i].toLocaleLowerCase(locale);
    const status = statuses[i];
    if (!next[letter] || rank[status] > rank[next[letter]]) {
      next[letter] = status;
    }
  }
  return next;
}
