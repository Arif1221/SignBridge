import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Volume2 } from "lucide-react";
import { SignIllustration } from "@/components/sign-illustration";
import { Button } from "@/components/ui/button";
import { getSign, SIGNS } from "@/lib/signs";
import { speak } from "@/lib/speech";

export const Route = createFileRoute("/learn/$slug")({
  component: SignDetail,
});

function SignDetail() {
  const { slug } = Route.useParams();
  const sign = getSign(slug);
  if (!sign) throw notFound();
  const idx = SIGNS.findIndex((s) => s.id === sign.id);
  const prev = SIGNS[idx - 1];
  const next = SIGNS[idx + 1];

  return (
    <>
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Dictionary
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
        <SignIllustration sign={sign} className="w-full" />
        <div>
          <p className="text-sm font-medium text-accent">
            {sign.category} · {idx + 1} / {SIGNS.length}
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-tight">{sign.spoken}</h1>
          <p className="text-lg text-muted">{sign.hindi}</p>
          <p className="mt-1 font-mono text-sm text-subtle">{sign.gloss}</p>
          <p className="mt-5 max-w-prose text-base leading-relaxed">{sign.howTo}</p>
          {sign.note ? (
            <p className="mt-3 max-w-prose rounded-md border border-border bg-surface p-3 text-sm text-muted">
              {sign.note}
            </p>
          ) : null}
          <ul className="mt-5 space-y-1 text-sm text-muted">
            <li>Hands: {sign.twoHands ? "two" : "one"}</li>
            <li>Palm: {sign.palm}</li>
            <li>Height: {sign.height}</li>
            <li>Motion: {sign.motion}</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="button" onClick={() => speak(`${sign.spoken}. ${sign.hindi}.`)}>
              <Volume2 className="size-4" /> Speak
            </Button>
            <Link
              to="/sign-to-voice"
              className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-4 text-sm font-medium"
            >
              Practice with camera
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-between text-sm">
        {prev ? (
          <Link to="/learn/$slug" params={{ slug: prev.id }} className="text-accent hover:underline">
            ← {prev.spoken}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to="/learn/$slug" params={{ slug: next.id }} className="text-accent hover:underline">
            {next.spoken} →
          </Link>
        ) : null}
      </div>
    </>
  );
}
