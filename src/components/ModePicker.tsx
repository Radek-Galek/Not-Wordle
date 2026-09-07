"use client";

import { MODES, type GameMode } from "@/lib/modes";

type ModePickerProps = {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
};

export function ModePicker({ mode, onChange }: ModePickerProps) {
  const active = MODES.find((m) => m.id === mode)!;

  return (
    <div className="mb-3 w-full">
      <div
        className="mode-picker flex w-full gap-1 rounded-lg p-1"
        role="tablist"
        aria-label="Game mode"
      >
        {MODES.map((m) => {
          const selected = m.id === mode;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(m.id)}
              className={`mode-tab flex-1 rounded-md px-2 py-2 text-xs font-bold tracking-wide uppercase transition sm:text-sm ${
                selected ? "mode-tab--active" : ""
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs text-[var(--ink-muted)] sm:text-sm">
        {active.blurb}
      </p>
    </div>
  );
}
