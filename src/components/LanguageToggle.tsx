"use client";

import type { Lang } from "@/lib/i18n";
import { LANGS, UI } from "@/lib/i18n";

type LanguageToggleProps = {
  lang: Lang;
  onChange: (lang: Lang) => void;
};

export function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  return (
    <div
      className="lang-toggle inline-flex gap-0.5 rounded-lg p-0.5"
      role="group"
      aria-label={UI[lang].langAria}
    >
      {LANGS.map((item) => {
        const selected = item.id === lang;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={selected}
            className={`lang-tab rounded-md px-2.5 py-1 text-xs font-bold tracking-wide ${
              selected ? "lang-tab--active" : ""
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
