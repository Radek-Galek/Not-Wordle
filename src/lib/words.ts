import enAnswers from "@/data/en/answers.json";
import enValid from "@/data/en/valid.json";
import plAnswers from "@/data/pl/answers.json";
import plValid from "@/data/pl/valid.json";
import type { Lang } from "./i18n";

type Dict = {
  answers: string[];
  answerSet: Set<string>;
  valid: Set<string>;
  /** Folded ASCII → Polish words that fold to it */
  foldMap: Map<string, string[]>;
};

const PL_FOLD: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
};

function buildFoldMap(words: string[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const word of words) {
    const folded = foldWord(word, "pl");
    const list = map.get(folded);
    if (list) list.push(word);
    else map.set(folded, [word]);
  }
  return map;
}

function makeDict(answers: string[], validList: string[]): Dict {
  const valid = new Set(validList);
  for (const a of answers) valid.add(a);
  return {
    answers,
    answerSet: new Set(answers),
    valid,
    foldMap: buildFoldMap([...valid]),
  };
}

const DICTS: Record<Lang, Dict> = {
  en: makeDict(enAnswers as string[], enValid as string[]),
  pl: makeDict(plAnswers as string[], plValid as string[]),
};

/** Extra answers with boosted pick chance (prank / custom words). */
const PRANK_WORDS: Partial<Record<Lang, { word: string; chance: number }[]>> = {
  en: [{ word: "nigga", chance: 0.07 }],
};

export function foldLetter(letter: string, lang: Lang): string {
  const ch = letter.toLocaleLowerCase(lang);
  if (lang !== "pl") return ch;
  return PL_FOLD[ch] ?? ch;
}

export function foldWord(word: string, lang: Lang): string {
  return [...word.toLocaleLowerCase(lang)]
    .map((ch) => foldLetter(ch, lang))
    .join("");
}

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
export function resolveForcedAnswer(
  lang: Lang,
  forced?: string | null,
): string | null {
  if (!forced) return null;
  return resolveGuess(forced, lang);
}

/**
 * Map a typed guess to a dictionary word.
 * Polish: "czesc" → "cześć" when unique, or the answer if it matches the fold.
 */
export function resolveGuess(
  word: string,
  lang: Lang,
  answer?: string,
): string | null {
  const normalized = normalizeWord(word, lang);
  if ([...normalized].length !== WORD_LENGTH) return null;

  const dict = DICTS[lang];
  if (dict.valid.has(normalized)) return normalized;

  if (lang !== "pl") return null;

  const folded = foldWord(normalized, "pl");
  const candidates = dict.foldMap.get(folded) ?? [];
  if (candidates.length === 0) return null;

  if (answer && candidates.includes(answer)) return answer;
  if (candidates.length === 1) return candidates[0];

  const answerHits = candidates.filter((c) => dict.answerSet.has(c));
  if (answerHits.length === 1) return answerHits[0];
  if (answer && foldWord(answer, "pl") === folded) return answer;

  // Still ambiguous — prefer any single answer-list hit order stably
  if (answerHits.length > 1) return answerHits.sort()[0];
  return candidates.slice().sort()[0];
}

export function isValidGuess(word: string, lang: Lang, answer?: string): boolean {
  return resolveGuess(word, lang, answer) !== null;
}

export function normalizeWord(word: string, lang: Lang): string {
  return word.toLocaleLowerCase(lang);
}

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
