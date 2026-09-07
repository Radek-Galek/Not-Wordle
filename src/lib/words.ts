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

export function getAnswers(lang: Lang): string[] {
  return DICTS[lang].answers;
}

export function pickAnswer(lang: Lang): string {
  const list = DICTS[lang].answers;
  return list[Math.floor(Math.random() * list.length)];
}

export function isValidGuess(word: string, lang: Lang): boolean {
  return DICTS[lang].valid.has(word.toLocaleLowerCase(lang));
}

export function normalizeWord(word: string, lang: Lang): string {
  return word.toLocaleLowerCase(lang);
}

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
