"use client";

import type { Lang } from "@/lib/i18n";
import { UI } from "@/lib/i18n";

type HintsPanelProps = {
  lang: Lang;
  words: string[];
  remaining: number;
  open: boolean;
  unlocked: boolean;
  lockReason: string | null;
  shufflesLeft: number;
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
  unlocked,
  lockReason,
  shufflesLeft,
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
        disabled={disabled || !unlocked}
        className="hint-btn rounded-md px-2.5 py-1.5 text-[11px] font-bold tracking-wide uppercase disabled:opacity-40"
        title={!unlocked && lockReason ? lockReason : undefined}
      >
        {open ? t.hideHints : unlocked ? t.showHints : t.hintsLocked}
      </button>

      {!unlocked && lockReason && (
        <p className="hints-lock-msg px-3 text-center text-[10px] leading-snug text-[var(--ink-muted)]">
          {lockReason}
        </p>
      )}

      {open && unlocked && (
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
                {remaining === 0 ? t.hintsEmpty : t.hintsCount(words.length)}
              </p>
              <button
                type="button"
                onClick={onRefresh}
                disabled={disabled || words.length === 0 || shufflesLeft <= 0}
                className="hint-btn hint-btn--ghost shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase disabled:opacity-40"
              >
                {shufflesLeft > 0
                  ? `${t.shuffle} (${shufflesLeft})`
                  : t.shuffleDone}
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
