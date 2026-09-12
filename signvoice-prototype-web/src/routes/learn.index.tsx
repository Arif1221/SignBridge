import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SignIllustration } from "@/components/sign-illustration";
import { Input } from "@/components/ui/input";
import { CATEGORIES, searchSigns } from "@/lib/signs";

export const Route = createFileRoute("/learn/")({ component: Learn });

function Learn() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const signs = useMemo(() => {
    const found = searchSigns(q);
    return cat === "all" ? found : found.filter((s) => s.category === cat);
  }, [q, cat]);

  return (
    <>
      <header className="mb-6">
        <p className="text-sm font-medium text-accent">Dictionary</p>
        <h1 className="font-display text-3xl tracking-tight">Learn 30 ISL signs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          This is the same vocabulary used by the recognizer. Signs outside this list are not supported.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gloss, English, Hindi…" />
        <div className="flex flex-wrap gap-1">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")} label="All" />
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} label={c.label} />
          ))}
        </div>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {signs.map((sign) => (
          <li key={sign.id}>
            <Link
              to="/learn/$slug"
              params={{ slug: sign.id }}
              className="flex h-full gap-3 rounded-xl border border-border bg-surface p-3 shadow-card hover:border-accent"
            >
              <SignIllustration sign={sign} animate={false} className="size-20 shrink-0" />
              <div className="min-w-0">
                <p className="font-display text-lg tracking-tight">{sign.spoken}</p>
                <p className="text-sm text-muted">{sign.hindi}</p>
                <p className="mt-1 line-clamp-2 text-xs text-subtle">{sign.howTo}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {signs.length === 0 ? <p className="mt-8 text-sm text-muted">No signs match that search.</p> : null}
    </>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-11 rounded-full bg-ink px-3 text-sm text-bg"
          : "h-11 rounded-full border border-border bg-surface px-3 text-sm text-muted"
      }
    >
      {label}
    </button>
  );
}
