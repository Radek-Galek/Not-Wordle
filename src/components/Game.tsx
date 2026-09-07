"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  evaluateGuess,
  mergeKeyStatuses,
  type LetterStatus,
} from "@/lib/evaluate";
import { isHardModeCompliant } from "@/lib/hardMode";
import { sampleHints } from "@/lib/hints";
import type { GameMode } from "@/lib/modes";
import { isValidGuess, MAX_GUESSES, pickAnswer, WORD_LENGTH } from "@/lib/words";
import { Board } from "./Board";
import { HintsPanel } from "./HintsPanel";
import { Keyboard } from "./Keyboard";
import { ModePicker } from "./ModePicker";

type GameStatus = "playing" | "won" | "lost";

export function Game() {
  const [mode, setMode] = useState<GameMode>("coach");
  const [answer, setAnswer] = useState(() => pickAnswer());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<LetterStatus[][]>([]);
  const [current, setCurrent] = useState("");
  const [keyStatuses, setKeyStatuses] = useState<Record<string, LetterStatus>>(
    {},
  );
  const [status, setStatus] = useState<GameStatus>("playing");
  const [message, setMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [hintWords, setHintWords] = useState<string[]>([]);
  const [hintRemaining, setHintRemaining] = useState(0);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((text: string, ms = 1600) => {
    setMessage(text);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(null), ms);
  }, []);

  const refreshHints = useCallback(
    (nextGuesses: string[], nextEvals: LetterStatus[][]) => {
      const sample = sampleHints(nextGuesses, nextEvals, 10);
      setHintWords(sample.words);
      setHintRemaining(sample.remaining);
    },
    [],
  );

  const resetBoard = useCallback(() => {
    setAnswer(pickAnswer());
    setGuesses([]);
    setEvaluations([]);
    setCurrent("");
    setKeyStatuses({});
    setStatus("playing");
    setMessage(null);
    setShake(false);
    setRevealingRow(null);
    setHintsOpen(false);
    refreshHints([], []);
  }, [refreshHints]);

  const changeMode = useCallback(
    (next: GameMode) => {
      setMode(next);
      setAnswer(pickAnswer());
      setGuesses([]);
      setEvaluations([]);
      setCurrent("");
      setKeyStatuses({});
      setStatus("playing");
      setMessage(null);
      setShake(false);
      setRevealingRow(null);
      setHintsOpen(false);
      refreshHints([], []);
    },
    [refreshHints],
  );

  useEffect(() => {
    refreshHints([], []);
  }, [refreshHints]);

  const submit = useCallback(() => {
    if (status !== "playing" || revealingRow !== null) return;

    if (current.length < WORD_LENGTH) {
      flash("Not enough letters");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!isValidGuess(current)) {
      flash("Not in word list");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const guess = current.toLowerCase();

    if (mode === "hard") {
      const hard = isHardModeCompliant(guess, guesses, evaluations);
      if (!hard.ok) {
        flash(hard.reason);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
    }

    const result = evaluateGuess(guess, answer);
    const rowIndex = guesses.length;
    const nextGuesses = [...guesses, guess];
    const nextEvals = [...evaluations, result];

    setGuesses(nextGuesses);
    setEvaluations(nextEvals);
    setCurrent("");
    setRevealingRow(rowIndex);

    const revealMs = WORD_LENGTH * 320 + 120;
    setTimeout(() => {
      setKeyStatuses((k) => mergeKeyStatuses(k, guess, result));
      setRevealingRow(null);
      refreshHints(nextGuesses, nextEvals);

      if (guess === answer) {
        setStatus("won");
        flash("Nice!", 4000);
      } else if (rowIndex + 1 >= MAX_GUESSES) {
        setStatus("lost");
        flash(answer.toUpperCase(), 8000);
      }
    }, revealMs);
  }, [
    answer,
    current,
    evaluations,
    flash,
    guesses,
    mode,
    refreshHints,
    revealingRow,
    status,
  ]);

  const onKey = useCallback(
    (key: string) => {
      if (status !== "playing" || revealingRow !== null) return;

      if (key === "ENTER") {
        submit();
        return;
      }
      if (key === "BACKSPACE") {
        setCurrent((c) => c.slice(0, -1));
        return;
      }
      if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) {
        setCurrent((c) => c + key.toLowerCase());
      }
    },
    [current.length, revealingRow, status, submit],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "Enter") onKey("ENTER");
      else if (e.key === "Backspace") onKey("BACKSPACE");
      else if (/^[a-zA-Z]$/.test(e.key)) onKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  const pickHint = useCallback(
    (word: string) => {
      if (status !== "playing" || revealingRow !== null) return;
      setCurrent(word.toLowerCase());
    },
    [revealingRow, status],
  );

  const inputLocked = status !== "playing" || revealingRow !== null;

  return (
    <div className="flex w-full max-w-[520px] flex-1 flex-col items-center">
      <ModePicker mode={mode} onChange={changeMode} />

      <div className="relative mb-2 flex h-10 w-full items-center justify-center">
        {message && (
          <div
            className="toast absolute z-10 rounded-md bg-[var(--ink)] px-3 py-2 text-sm font-bold tracking-wide text-[var(--paper)] shadow-md"
            role="status"
          >
            {message}
          </div>
        )}
      </div>

      <Board
        guesses={guesses}
        evaluations={evaluations}
        current={current}
        shake={shake}
        revealingRow={revealingRow}
        won={status === "won"}
      />

      <div className="mt-auto flex w-full flex-col items-center gap-3 pt-4 pb-3">
        {mode === "coach" && status === "playing" && (
          <HintsPanel
            words={hintWords}
            remaining={hintRemaining}
            open={hintsOpen}
            onToggle={() => {
              if (!hintsOpen) refreshHints(guesses, evaluations);
              setHintsOpen((o) => !o);
            }}
            onRefresh={() => refreshHints(guesses, evaluations)}
            onPick={pickHint}
            disabled={inputLocked}
          />
        )}

        {(status === "won" || status === "lost") && (
          <button
            type="button"
            onClick={resetBoard}
            className="new-game-btn rounded-md bg-[var(--correct)] px-5 py-2.5 text-sm font-bold tracking-wider text-white uppercase transition hover:brightness-110 active:scale-[0.98]"
          >
            New game
          </button>
        )}
        <Keyboard keyStatuses={keyStatuses} onKey={onKey} />
      </div>
    </div>
  );
}
