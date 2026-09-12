import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CameraStage } from "@/components/camera-stage";
import { SignIllustration } from "@/components/sign-illustration";
import { Badge } from "@/components/ui/badge";
import type { Prediction } from "@/lib/classifier";
import { speak } from "@/lib/speech";

export const Route = createFileRoute("/sign-to-voice")({ component: SignToVoice });

function SignToVoice() {
  const [live, setLive] = useState<Prediction | null>(null);
  const [stable, setStable] = useState<Prediction | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const onStable = useCallback((p: Prediction) => {
    setStable(p);
    setLog((prev) => [`${p.sign.spoken} (${Math.round(p.confidence * 100)}%)`, ...prev].slice(0, 6));
    speak(p.sign.spoken);
  }, []);

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-sm font-medium text-accent">Camera recognition</p>
        <h1 className="font-display text-3xl tracking-tight">Sign to voice</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Show one isolated sign from the 30-sign vocabulary. The camera tracks one or two hands and the recognizer scores a
          pose template, smooths across frames, then speaks. Continuous signing is out of scope.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <CameraStage enabled onStable={onStable} live={setLive} />

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wide text-subtle">Heard</p>
            {stable ? (
              <div className="mt-3 flex items-start gap-4">
                <SignIllustration sign={stable.sign} className="size-28 shrink-0" />
                <div>
                  <p className="font-display text-3xl tracking-tight">{stable.sign.spoken}</p>
                  <p className="text-sm text-muted">{stable.sign.hindi}</p>
                  <p className="mt-2 font-mono text-sm tabular-nums text-accent">
                    {Math.round(stable.confidence * 100)}% confidence
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Waiting for a stable sign…</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-subtle">Live guess</p>
              {live ? <Badge>{Math.round(live.confidence * 100)}%</Badge> : null}
            </div>
            <p className="mt-2 font-display text-xl">{live ? live.sign.spoken : "—"}</p>
            <p className="text-sm text-muted">{live ? live.sign.howTo : "Show a clear hand to the camera."}</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wide text-subtle">Spoken log</p>
            {log.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Nothing spoken yet.</p>
            ) : (
              <ol className="mt-2 space-y-1 text-sm">
                {log.map((line, i) => (
                  <li key={`${line}-${i}`} className="tabular-nums text-ink">
                    {line}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
