import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, Mic, BookOpen } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SIGNS } from "@/lib/signs";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <p className="text-sm font-medium tracking-wide text-accent">ISL · 30 signs</p>
          <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            Sign language to voice, and back.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            SignBridge recognizes a focused set of 30 Indian Sign Language signs from the camera.
            Hand landmarks are processed locally in the browser, and the recognizer is limited to isolated signs.
          </p>
        </div>
        <p className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-muted shadow-card">
          This version focuses on isolated signs rather than continuous conversation. Numbers 6–10 use
          the poses included in the current vocabulary. Voice to sign uses a fixed sign dictionary.
        </p>
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        <ModeCard
          to="/sign-to-voice"
          icon={Camera}
          title="Sign to voice"
          body="Camera, hand landmarks, classifier, then speech."
        />
        <ModeCard
          to="/voice-to-sign"
          icon={Mic}
          title="Voice to sign"
          body="Speak or type. See the matching ISL pose sequence for supported words."
        />
        <ModeCard
          to="/learn"
          icon={BookOpen}
          title="Learn the 30"
          body="Gloss, Hindi cue, how-to, and a pose diagram for every sign."
        />
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl tracking-tight">Vocabulary</h2>
          <Link to="/learn" className="text-sm text-accent hover:underline">
            Open dictionary
          </Link>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SIGNS.map((s) => (
            <li key={s.id}>
              <Link
                to="/learn/$slug"
                params={{ slug: s.id }}
                className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-3 text-sm hover:border-accent hover:text-accent"
              >
                {s.spoken}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function ModeCard({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: string;
  icon: typeof Camera;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-card transition-transform duration-150 hover:-translate-y-0.5"
    >
      <Icon className="size-5 text-accent" />
      <h3 className="mt-4 font-display text-xl tracking-tight">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
        Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
