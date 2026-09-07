import { Game } from "@/components/Game";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-3 pt-4 pb-2">
      <header className="brand-rise relative mb-1 border-b border-[var(--header-line)] pb-3 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[1.85rem] leading-none tracking-tight text-[var(--ink)] uppercase sm:text-[2.15rem]">
          Endless
        </h1>
        <p className="mt-2 text-sm tracking-wide text-[var(--ink-muted)]">
          Unlimited Wordle · coach hints · no ads
        </p>
      </header>

      <main className="board-rise flex flex-1 flex-col items-center pt-2">
        <Game />
      </main>
    </div>
  );
}
