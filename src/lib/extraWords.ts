import { WORD_LENGTH } from "./words-constants";

/** Parse comma-separated 5-letter extras from an env string. */
export function parseExtraWords(raw: string | undefined | null): string[] {
  if (!raw?.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length === WORD_LENGTH),
    ),
  ];
}

/** Runtime English extras (loaded from /api/extra-words). */
let englishExtras: string[] = [];
let loadPromise: Promise<string[]> | null = null;

export function getEnglishExtras(): string[] {
  return englishExtras;
}

export function setEnglishExtras(words: string[]): void {
  englishExtras = [
    ...new Set(
      words
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length === WORD_LENGTH),
    ),
  ];
}

/** Ensure extras are fetched before validating English guesses. */
export function ensureEnglishExtras(): Promise<string[]> {
  if (typeof window === "undefined") return Promise.resolve(englishExtras);
  if (loadPromise) return loadPromise;

  loadPromise = fetch("/api/extra-words")
    .then((res) => res.json())
    .then((data: { words?: string[] }) => {
      setEnglishExtras(Array.isArray(data.words) ? data.words : []);
      return englishExtras;
    })
    .catch(() => {
      setEnglishExtras([]);
      return englishExtras;
    });

  return loadPromise;
}
