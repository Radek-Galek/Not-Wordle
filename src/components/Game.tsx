"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  evaluateGuess,
  mergeKeyStatuses,
  type LetterStatus,
} from "@/lib/evaluate";
import { isHardModeCompliant } from "@/lib/hardMode";
import { sampleHints } from "@/lib/hints";
import type { Lang } from "@/lib/i18n";
import { UI } from "@/lib/i18n";
import type { GameMode } from "@/lib/modes";
import {
  isValidGuess,
  MAX_GUESSES,
  normalizeWord,
  pickAnswer,
  WORD_LENGTH,
} from "@/lib/words";
import { Board } from "./Board";
import { HintsPanel } from "./HintsPanel";
import { Keyboard } from "./Keyboard";
import { LanguageToggle } from "./LanguageToggle";
import { ModePicker } from "./ModePicker";

type GameStatus = "playing" | "won" | "lost";

const LANG_KEY = "endless-lang";

function readStoredLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANG_KEY);
  return stored === "pl" || stored === "en" ? stored : "en";
}

export function Game() {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<GameMode>("coach");
  const [answer, setAnswer] = useState(() => pickAnswer("en"));
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

  const t = UI[lang];

  useEffect(() => {
    const stored = readStoredLang();
    if (stored !== "en") {
      setLang(stored);
      setAnswer(pickAnswer(stored));
    }
    const sample = sampleHints(stored, [], [], 10);
    setHintWords(sample.words);
    setHintRemaining(sample.remaining);
  }, []);

  const flash = useCallback((text: string, ms = 1600) => {
    setMessage(text);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(null), ms);
  }, []);

  const refreshHints = useCallback(
    (nextLang: Lang, nextGuesses: string[], nextEvals: LetterStatus[][]) => {
      const sample = sampleHints(nextLang, nextGuesses, nextEvals, 10);
      setHintWords(sample.words);
      setHintRemaining(sample.remaining);
    },
    [],
  );

  const clearBoard = useCallback((nextLang: Lang) => {
    setAnswer(pickAnswer(nextLang));
    setGuesses([]);
    setEvaluations([]);
    setCurrent("");
    setKeyStatuses({});
    setStatus("playing");
    setMessage(null);
    setShake(false);
    setRevealingRow(null);
    setHintsOpen(false);
  }, []);

  const changeLang = useCallback(
    (next: Lang) => {
      setLang(next);
      window.localStorage.setItem(LANG_KEY, next);
      clearBoard(next);
      refreshHints(next, [], []);
    },
    [clearBoard, refreshHints],
  );

  const changeMode = useCallback(
    (next: GameMode) => {
      setMode(next);
      clearBoard(lang);
      refreshHints(lang, [], []);
    },
    [clearBoard, lang, refreshHints],
  );

  const resetBoard = useCallback(() => {
    clearBoard(lang);
    refreshHints(lang, [], []);
  }, [clearBoard, lang, refreshHints]);

  const submit = useCallback(() => {
    if (status !== "playing" || revealingRow !== null) return;

    if ([...current].length < WORD_LENGTH) {
      flash(t.notEnough);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!isValidGuess(current, lang)) {
      flash(t.notInList);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const guess = normalizeWord(current, lang);

    if (mode === "hard") {
      const hard = isHardModeCompliant(guess, guesses, evaluations, lang);
      if (!hard.ok) {
        flash(hard.reason);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
    }

    const result = evaluateGuess(guess, answer, lang);
    const rowIndex = guesses.length;
    const nextGuesses = [...guesses, guess];
    const nextEvals = [...evaluations, result];

    setGuesses(nextGuesses);
    setEvaluations(nextEvals);
    setCurrent("");
    setRevealingRow(rowIndex);
    setHintsOpen(false);

    const revealMs = WORD_LENGTH * 320 + 120;
    setTimeout(() => {
      setKeyStatuses((k) => mergeKeyStatuses(k, guess, result, lang));
      setRevealingRow(null);
      refreshHints(lang, nextGuesses, nextEvals);

      if (guess === answer) {
        setStatus("won");
        flash(t.nice, 4000);
      } else if (rowIndex + 1 >= MAX_GUESSES) {
        setStatus("lost");
        flash(answer.toLocaleUpperCase(lang), 8000);
      }
    }, revealMs);
  }, [
    answer,
    current,
    evaluations,
    flash,
    guesses,
    lang,
    mode,
    refreshHints,
    revealingRow,
    status,
    t.nice,
    t.notEnough,
    t.notInList,
  ]);

  const onKey = useCallback(
    (key: string) => {
      if (status !== "playing" || revealingRow !== null) return;

      if (key === "ENTER") {
        submit();
        return;
      }
      if (key === "BACKSPACE") {
        setCurrent((c) => [...c].slice(0, -1).join(""));
        return;
      }
      if (key.length === 1 && [...current].length < WORD_LENGTH) {
        setCurrent((c) => c + key.toLocaleLowerCase(lang));
      }
    },
    [current, lang, revealingRow, status, submit],
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
      else if (e.key === "Backspace") {
        e.preventDefault();
        onKey("BACKSPACE");
      } else if (e.key.length === 1 && /\p{L}/u.test(e.key)) {
        onKey(e.key.toLocaleUpperCase(lang));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lang, onKey]);

  const pickHint = useCallback(
    (word: string) => {
      if (status !== "playing" || revealingRow !== null) return;
      setCurrent(normalizeWord(word, lang));
    },
    [lang, revealingRow, status],
  );

  const inputLocked = status !== "playing" || revealingRow !== null;

  return (
    <div className="game-shell">
      <header className="game-header">
        <h1 className="game-brand">{t.brand}</h1>
        <LanguageToggle lang={lang} onChange={changeLang} />
      </header>

      <ModePicker lang={lang} mode={mode} onChange={changeMode} />

      <div className="game-board-wrap">
        {message && (
          <div className="toast" role="status">
            {message}
          </div>
        )}
        <Board
          guesses={guesses}
          evaluations={evaluations}
          current={current}
          shake={shake}
          revealingRow={revealingRow}
          won={status === "won"}
          lang={lang}
        />
      </div>

      <div className="game-footer">
        {mode === "coach" && status === "playing" && (
          <HintsPanel
            lang={lang}
            words={hintWords}
            remaining={hintRemaining}
            open={hintsOpen}
            onToggle={() => {
              if (!hintsOpen) refreshHints(lang, guesses, evaluations);
              setHintsOpen((o) => !o);
            }}
            onRefresh={() => refreshHints(lang, guesses, evaluations)}
            onPick={pickHint}
            onClose={() => setHintsOpen(false)}
            disabled={inputLocked}
          />
        )}

        {(status === "won" || status === "lost") && (
          <button
            type="button"
            onClick={resetBoard}
            className="new-game-btn rounded-md bg-[var(--correct)] px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase transition hover:brightness-110 active:scale-[0.98]"
          >
            {t.newGame}
          </button>
        )}

        <Keyboard lang={lang} keyStatuses={keyStatuses} onKey={onKey} />
      </div>
    </div>
  );
}
