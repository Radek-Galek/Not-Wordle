"use client";

import type { LetterStatus } from "@/lib/evaluate";
import type { Lang } from "@/lib/i18n";
import { MAX_GUESSES, WORD_LENGTH } from "@/lib/words";
import { Tile } from "./Tile";

type BoardProps = {
  lang: Lang;
  guesses: string[];
  evaluations: LetterStatus[][];
  current: string;
  shake: boolean;
  revealingRow: number | null;
  won: boolean;
};

export function Board({
  lang,
  guesses,
  evaluations,
  current,
  shake,
  revealingRow,
  won,
}: BoardProps) {
  const rows = Array.from({ length: MAX_GUESSES }, (_, row) => {
    const isCurrent = row === guesses.length;
    const guessChars = [...(isCurrent ? current : (guesses[row] ?? ""))];
    const evaluation = evaluations[row];
    const isRevealing = revealingRow === row;
    const isShaking = shake && isCurrent;
    const isBounce = won && row === guesses.length - 1;

    return (
      <div
        key={row}
        className={`board-row flex ${isShaking ? "shake" : ""} ${isBounce ? "bounce-win" : ""}`}
      >
        {Array.from({ length: WORD_LENGTH }, (_, col) => {
          const letter = guessChars[col] ?? "";
          const status = evaluation?.[col];
          return (
            <Tile
              key={col}
              letter={letter}
              lang={lang}
              status={status}
              revealing={isRevealing}
              delayMs={col * 320}
              filled={Boolean(letter) && !status}
            />
          );
        })}
      </div>
    );
  });

  return <div className="flex flex-col gap-[var(--tile-gap)]">{rows}</div>;
}
