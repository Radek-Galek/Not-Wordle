import type { LetterStatus } from "./evaluate";

/**
 * Official-style hard mode: greens stay put, yellows must be reused somewhere.
 */
export function isHardModeCompliant(
  guess: string,
  previousGuesses: string[],
  previousEvals: LetterStatus[][],
): { ok: true } | { ok: false; reason: string } {
  if (previousGuesses.length === 0) return { ok: true };

  const g = guess.toLowerCase().split("");

  for (let row = 0; row < previousGuesses.length; row++) {
    const prev = previousGuesses[row].toLowerCase().split("");
    const ev = previousEvals[row];

    for (let i = 0; i < 5; i++) {
      if (ev[i] === "correct" && g[i] !== prev[i]) {
        return {
          ok: false,
          reason: `${prev[i].toUpperCase()} must stay in spot ${i + 1}`,
        };
      }
    }
  }

  for (let row = 0; row < previousGuesses.length; row++) {
    const prev = previousGuesses[row].toLowerCase().split("");
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
          reason: `Must use ${prev[i].toUpperCase()}`,
        };
      }
    }
  }

  return { ok: true };
}
