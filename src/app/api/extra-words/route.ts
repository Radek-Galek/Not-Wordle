import { parseExtraWords } from "@/lib/extraWords";

export const dynamic = "force-dynamic";

/**
 * Runtime extras from server env so Vercel does not need a rebuild
 * for NEXT_PUBLIC_ inlining. Prefer EN_EXTRA_WORDS; NEXT_PUBLIC_ still works.
 */
export async function GET() {
  const words = parseExtraWords(
    process.env.EN_EXTRA_WORDS ?? process.env.NEXT_PUBLIC_EN_EXTRA_WORDS,
  );
  return Response.json(
    { words },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
