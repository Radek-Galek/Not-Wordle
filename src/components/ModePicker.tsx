"use client";

import type { Lang } from "@/lib/i18n";
import { UI } from "@/lib/i18n";
import { MODE_IDS, type GameMode } from "@/lib/modes";

type ModePickerProps = {
  lang: Lang;
  mode: GameMode;
  onChange: (mode: GameMode) => void;
};

export function ModePicker({ lang, mode, onChange }: ModePickerProps) {
  const t = UI[lang];

  return (
    <div
      className="mode-picker flex w-full gap-0.5 rounded-md p-0.5"
      role="tablist"
      aria-label={t.modeAria}
    >
      {MODE_IDS.map((id) => {
        const selected = id === mode;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={`mode-tab flex-1 rounded px-1.5 py-1.5 text-[11px] font-bold tracking-wide uppercase transition ${
              selected ? "mode-tab--active" : ""
            }`}
          >
            {t.modes[id]}
          </button>
        );
      })}
    </div>
  );
}
