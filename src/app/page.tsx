import { Game } from "@/components/Game";

export default function Home() {
  return (
    <div className="page-shell">
      <main className="h-full min-h-0">
        <Game />
      </main>
    </div>
  );
}
