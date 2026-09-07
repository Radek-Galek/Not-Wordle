export type GameMode = "classic" | "coach" | "hard";

export const MODES: {
  id: GameMode;
  label: string;
  blurb: string;
}[] = [
  {
    id: "classic",
    label: "Classic",
    blurb: "Standard Wordle — six guesses, no help",
  },
  {
    id: "coach",
    label: "Coach",
    blurb: "Hints: 10 words still possible from your clues",
  },
  {
    id: "hard",
    label: "Hard",
    blurb: "Must reuse greens and yellows — no soft guesses",
  },
];
