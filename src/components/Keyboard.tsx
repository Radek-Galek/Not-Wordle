"use client";

import type { LetterStatus } from "@/lib/evaluate";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

type KeyboardProps = {
  keyStatuses: Record<string, LetterStatus>;
  onKey: (key: string) => void;
};

export function Keyboard({ keyStatuses, onKey }: KeyboardProps) {
  return (
    <div className="flex w-full flex-col gap-1.5 px-1">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const isWide = key === "ENTER" || key === "BACKSPACE";
            const status = keyStatuses[key.toLowerCase()];
            const label = key === "BACKSPACE" ? "⌫" : key === "ENTER" ? "ENTER" : key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onKey(key)}
                className={`key ${isWide ? "key--wide" : ""} ${status ? `key--${status}` : ""}`}
                aria-label={key === "BACKSPACE" ? "Backspace" : key}
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
