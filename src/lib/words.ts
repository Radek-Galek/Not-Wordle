import answers from "@/data/answers.json";
import valid from "@/data/valid.json";

const ANSWERS = answers as string[];
const VALID = new Set(valid as string[]);

export function getAnswers(): string[] {
  return ANSWERS;
}

export function pickAnswer(): string {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
}

export function isValidGuess(word: string): boolean {
  return VALID.has(word.toLowerCase());
}

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
