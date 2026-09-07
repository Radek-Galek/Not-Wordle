"use client";

import type { CSSProperties } from "react";
import type { LetterStatus } from "@/lib/evaluate";

type TileProps = {
  letter: string;
  status?: LetterStatus;
  revealing?: boolean;
  delayMs?: number;
  filled?: boolean;
};

export function Tile({
  letter,
  status,
  revealing,
  delayMs = 0,
  filled,
}: TileProps) {
  const revealClass = revealing && status ? "tile--reveal" : "";
  const filledClass = filled ? "tile--filled" : "";
  const revealedClass = status && !revealing ? "tile--revealed" : "";
  const backStatus = status ? `tile-face--${status}` : "";

  return (
    <div
      className={`tile ${revealClass} ${filledClass} ${revealedClass}`}
      style={
        revealing
          ? ({ "--reveal-delay": `${delayMs}ms` } as CSSProperties)
          : undefined
      }
    >
      <span className="tile-face tile-face--front">{letter}</span>
      <span className={`tile-face tile-face--back ${backStatus}`}>{letter}</span>
    </div>
  );
}
