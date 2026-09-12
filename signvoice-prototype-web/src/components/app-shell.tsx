import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Hand, House, BookOpen, Mic, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: House },
  { to: "/sign-to-voice", label: "Sign to voice", icon: Camera },
  { to: "/voice-to-sign", label: "Voice to sign", icon: Mic },
  { to: "/learn", label: "Learn", icon: BookOpen },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-fg">
              <Hand className="size-4" strokeWidth={2} />
            </span>
            <span className="font-display text-lg tracking-tight">SignBridge</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm",
                    active ? "bg-ink text-bg" : "text-muted hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-6 pb-24 sm:pb-10">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 px-2 py-2 sm:hidden">
        <div className="grid grid-cols-4 gap-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-sm text-[11px]",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <Icon className="size-4" />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
