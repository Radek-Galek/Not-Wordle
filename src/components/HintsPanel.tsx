"use client";

type HintsPanelProps = {
  words: string[];
  remaining: number;
  open: boolean;
  onToggle: () => void;
  onRefresh: () => void;
  onPick: (word: string) => void;
  disabled?: boolean;
};

export function HintsPanel({
  words,
  remaining,
  open,
  onToggle,
  onRefresh,
  onPick,
  disabled,
}: HintsPanelProps) {
  return (
    <div className="hints w-full">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="hint-btn rounded-md px-3 py-2 text-xs font-bold tracking-wide uppercase disabled:opacity-40"
        >
          {open ? "Hide hints" : "Show hints"}
        </button>
        {open && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={disabled || words.length === 0}
            className="hint-btn hint-btn--ghost rounded-md px-3 py-2 text-xs font-bold tracking-wide uppercase disabled:opacity-40"
          >
            Shuffle
          </button>
        )}
      </div>

      {open && (
        <div className="hints-panel mt-3 rounded-lg px-3 py-3">
          <p className="mb-2 text-center text-xs text-[var(--ink-muted)]">
            {remaining === 0
              ? "No candidates left in the answer list — keep guessing."
              : `${remaining} word${remaining === 1 ? "" : "s"} still fit your clues. Tap one to fill it in.`}
          </p>
          {words.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-1.5">
              {words.map((word) => (
                <li key={word}>
                  <button
                    type="button"
                    onClick={() => onPick(word)}
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
      )}
    </div>
  );
}
