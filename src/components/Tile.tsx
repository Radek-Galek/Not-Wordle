"use client";

import type { CSSProperties } from "react";
import type { LetterStatus } from "@/lib/evaluate";
import type { Lang } from "@/lib/i18n";

type TileProps = {
  letter: string;
  lang: Lang;
  status?: LetterStatus;
  revealing?: boolean;
  delayMs?: number;
  filled?: boolean;
};

export function Tile({
  letter,
  lang,
  status,
  revealing,
  delayMs = 0,
  filled,
}: TileProps) {
  const revealClass = revealing && status ? "tile--reveal" : "";
  const filledClass = filled ? "tile--filled" : "";
  const revealedClass = status && !revealing ? "tile--revealed" : "";
  const backStatus = status ? `tile-face--${status}` : "";
  const display = letter ? letter.toLocaleUpperCase(lang) : "";

  return (
    <div
      className={`tile ${revealClass} ${filledClass} ${revealedClass}`}
      style={
        revealing
          ? ({ "--reveal-delay": `${delayMs}ms` } as CSSProperties)
          : undefined
      }
    >
      <span className="tile-face tile-face--front">{display}</span>
      <span className={`tile-face tile-face--back ${backStatus}`}>{display}</span>
    </div>
  );
}
