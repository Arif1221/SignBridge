import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SignIllustration } from "@/components/sign-illustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { matchSpokenToSigns, SIGNS, type Sign } from "@/lib/signs";
import { listen, speak, type SpeechHandle } from "@/lib/speech";

export const Route = createFileRoute("/voice-to-sign")({ component: VoiceToSign });

function VoiceToSign() {
  const [query, setQuery] = useState("");
  const [interim, setInterim] = useState("");
  const [matches, setMatches] = useState<Sign[]>([]);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const handle = useRef<SpeechHandle | null>(null);

  function applyText(text: string) {
    setError(null);
    const result = matchSpokenToSigns(text);
    setMatches(result.matches);
    setUnmatched(result.unmatched);
    if (result.matches.length === 0) {
      setError(`No match in the 30-sign vocabulary for “${text}”.`);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    applyText(query);
  }

  function toggleListen() {
    setError(null);
    if (listening) {
      handle.current?.stop();
      setListening(false);
      return;
    }
    try {
      handle.current = listen(
        (text, isFinal) => {
          setInterim(text);
          setQuery(text);
          if (isFinal) {
            setListening(false);
            setInterim("");
            applyText(text);
          }
        },
        (message) => {
          setListening(false);
          setInterim("");
          setError(`Speech recognition error: ${message}. You can type the phrase instead.`);
        },
      );
      setListening(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Microphone unavailable.");
    }
  }

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-sm font-medium text-accent">Speech to pose</p>
        <h1 className="font-display text-3xl tracking-tight">Voice to sign</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Speak or type a sentence. Speech or typed text is matched against the 30-sign vocabulary and shown in order. This is a dictionary-based
          representation, not continuous ISL generation.
        </p>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “hello”, “thank you”, or “I need water”…"
          aria-label="Words or sentence to sign"
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 sm:flex-none">
            Show signs
          </Button>
          <Button type="button" variant={listening ? "inverse" : "secondary"} onClick={toggleListen}>
            {listening ? <Square className="size-4" /> : <Mic className="size-4" />}
            {listening ? "Stop" : "Speak"}
          </Button>
        </div>
      </form>

      {listening ? <p className="mt-2 text-sm text-accent">Listening… {interim}</p> : null}
      {error ? <p className="mt-2 text-sm text-warn">{error}</p> : null}

      {matches.length ? (
        <section className="mt-8" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-subtle">Matched sequence</p>
              <h2 className="mt-1 font-display text-2xl tracking-tight">{matches.length} sign{matches.length === 1 ? "" : "s"}</h2>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={() => speak(matches.map((sign) => sign.spoken).join(", "))}>
              <Volume2 className="size-4" /> Hear mapping
            </Button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((sign, index) => (
              <article key={`${sign.id}-${index}`} className="rounded-xl border border-border bg-surface p-3 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-fg">
                    {index + 1}
                  </div>
                  <p className="font-display text-xl tracking-tight">{sign.spoken}</p>
                </div>
                <SignIllustration sign={sign} animate={false} className="mt-3 w-full" />
                <p className="mt-3 text-sm leading-relaxed text-muted">{sign.howTo}</p>
              </article>
            ))}
          </div>

          {unmatched.length ? (
            <p className="mt-4 rounded-md border border-border bg-surface p-3 text-sm text-muted">
              Not in the sign dictionary: <span className="font-medium text-ink">{unmatched.join(", ")}</span>
            </p>
          ) : null}
        </section>
      ) : (
        <p className="mt-8 text-sm text-muted">
          No sign selected yet. Try one of: {SIGNS.slice(0, 8).map((sign) => sign.spoken).join(", ")}…
        </p>
      )}
    </AppShell>
  );
}
