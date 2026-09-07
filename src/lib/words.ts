import enAnswers from "@/data/en/answers.json";
import enValid from "@/data/en/valid.json";
import plAnswers from "@/data/pl/answers.json";
import plValid from "@/data/pl/valid.json";
import type { Lang } from "./i18n";

type Dict = {
  answers: string[];
  valid: Set<string>;
};

const DICTS: Record<Lang, Dict> = {
  en: {
    answers: enAnswers as string[],
    valid: new Set(enValid as string[]),
  },
  pl: {
    answers: plAnswers as string[],
    valid: new Set(plValid as string[]),
  },
};

/** Extra answers with boosted pick chance (prank / custom words). */
const PRANK_WORDS: Partial<Record<Lang, { word: string; chance: number }[]>> = {
  en: [{ word: "nigga", chance: 0.15 }],
};

export function getAnswers(lang: Lang): string[] {
  return DICTS[lang].answers;
}

export function pickAnswer(lang: Lang): string {
  const pranks = PRANK_WORDS[lang] ?? [];
  for (const prank of pranks) {
    if (Math.random() < prank.chance) return prank.word;
  }
  const list = DICTS[lang].answers;
  return list[Math.floor(Math.random() * list.length)];
}

/** Force a specific answer when sharing a prank link (?word=radek). */
export function resolveForcedAnswer(lang: Lang, forced?: string | null): string | null {
  if (!forced) return null;
  const word = forced.toLocaleLowerCase(lang).trim();
  if ([...word].length !== WORD_LENGTH) return null;
  if (!isValidGuess(word, lang)) return null;
  return word;
}

export function isValidGuess(word: string, lang: Lang): boolean {
  return DICTS[lang].valid.has(word.toLocaleLowerCase(lang));
}

export function normalizeWord(word: string, lang: Lang): string {
  return word.toLocaleLowerCase(lang);
}

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
