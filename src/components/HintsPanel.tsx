"use client";

import type { Lang } from "@/lib/i18n";
import { UI } from "@/lib/i18n";

type HintsPanelProps = {
  lang: Lang;
  words: string[];
  remaining: number;
  open: boolean;
  onToggle: () => void;
  onRefresh: () => void;
  onPick: (word: string) => void;
  onClose: () => void;
  disabled?: boolean;
};

export function HintsPanel({
  lang,
  words,
  remaining,
  open,
  onToggle,
  onRefresh,
  onPick,
  onClose,
  disabled,
}: HintsPanelProps) {
  const t = UI[lang];

  return (
    <div className="hints-dock">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="hint-btn rounded-md px-2.5 py-1.5 text-[11px] font-bold tracking-wide uppercase disabled:opacity-40"
      >
        {open ? t.hideHints : t.showHints}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="hints-backdrop"
            aria-label={t.hideHints}
            onClick={onClose}
          />
          <div className="hints-panel" role="dialog" aria-label={t.showHints}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[11px] leading-snug text-[var(--ink-muted)]">
                {remaining === 0 ? t.hintsEmpty : t.hintsCount(remaining)}
              </p>
              <button
                type="button"
                onClick={onRefresh}
                disabled={disabled || words.length === 0}
                className="hint-btn hint-btn--ghost shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase disabled:opacity-40"
              >
                {t.shuffle}
              </button>
            </div>
            {words.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-1">
                {words.map((word) => (
                  <li key={word}>
                    <button
                      type="button"
                      onClick={() => {
                        onPick(word);
                        onClose();
                      }}
                      disabled={disabled}
                      className="hint-chip font-bold tracking-wider uppercase disabled:opacity-40"
                    >
                      {word}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
