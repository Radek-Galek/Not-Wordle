export type Lang = "en" | "pl";

export const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "pl", label: "PL" },
];

export type UiCopy = {
  brand: string;
  modes: Record<"classic" | "coach" | "hard", string>;
  modeAria: string;
  langAria: string;
  newGame: string;
  showHints: string;
  hideHints: string;
  shuffle: string;
  hintsEmpty: string;
  hintsCount: (n: number) => string;
  notEnough: string;
  notInList: string;
  nice: string;
  enter: string;
  backspace: string;
  hardMustStay: (letter: string, spot: number) => string;
  hardMustUse: (letter: string) => string;
};

export const UI: Record<Lang, UiCopy> = {
  en: {
    brand: "R3-DLE",
    modes: {
      classic: "Classic",
      coach: "Coach",
      hard: "Hard",
    },
    modeAria: "Game mode",
    langAria: "Language",
    newGame: "New game",
    showHints: "Hints",
    hideHints: "Close",
    shuffle: "Shuffle",
    hintsEmpty: "No candidates left — keep guessing.",
    hintsCount: (n) => `${n} still fit · tap to fill`,
    notEnough: "Not enough letters",
    notInList: "Not in word list",
    nice: "Nice!",
    enter: "ENTER",
    backspace: "Backspace",
    hardMustStay: (letter, spot) => `${letter} must stay in spot ${spot}`,
    hardMustUse: (letter) => `Must use ${letter}`,
  },
  pl: {
    brand: "R3-DLE",
    modes: {
      classic: "Klasyczny",
      coach: "Trener",
      hard: "Trudny",
    },
    modeAria: "Tryb gry",
    langAria: "Język",
    newGame: "Nowa gra",
    showHints: "Hinty",
    hideHints: "Zamknij",
    shuffle: "Losuj",
    hintsEmpty: "Brak kandydatów — zgaduj dalej.",
    hintsCount: (n) => `${n} pasuje · kliknij`,
    notEnough: "Za mało liter",
    notInList: "Brak w słowniku",
    nice: "Brawo!",
    enter: "ENTER",
    backspace: "Backspace",
    hardMustStay: (letter, spot) => `${letter} musi zostać na pozycji ${spot}`,
    hardMustUse: (letter) => `Musisz użyć ${letter}`,
  },
};
