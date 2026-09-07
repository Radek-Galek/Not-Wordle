"use client";

import type { LetterStatus } from "@/lib/evaluate";
import type { Lang } from "@/lib/i18n";
import { UI } from "@/lib/i18n";

const ROWS_EN = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const ROWS_PL = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
  ["ENTER", "Ą", "Ć", "Ę", "Ł", "Ń", "Ó", "Ś", "Ź", "Ż", "BACKSPACE"],
];

type KeyboardProps = {
  lang: Lang;
  keyStatuses: Record<string, LetterStatus>;
  onKey: (key: string) => void;
};

export function Keyboard({ lang, keyStatuses, onKey }: KeyboardProps) {
  const rows = lang === "pl" ? ROWS_PL : ROWS_EN;
  const t = UI[lang];

  return (
    <div className="flex w-full flex-col gap-1.5 px-1">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const isWide = key === "ENTER" || key === "BACKSPACE";
            const status = keyStatuses[key.toLocaleLowerCase(lang)];
            const label =
              key === "BACKSPACE" ? "⌫" : key === "ENTER" ? t.enter : key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onKey(key)}
                className={`key ${isWide ? "key--wide" : ""} ${key.length === 1 && lang === "pl" ? "key--compact" : ""} ${status ? `key--${status}` : ""}`}
                aria-label={key === "BACKSPACE" ? t.backspace : key}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
