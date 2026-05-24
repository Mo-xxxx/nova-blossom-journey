import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Activity, BookHeart, Sparkles, Settings, Flower2 } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/monitor", label: "Live", icon: Activity },
  { to: "/log", label: "Log", icon: BookHeart },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/resources", label: "Care", icon: Flower2 },
] as const;

export function AppShell({ children, title, subtitle, action }: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-md">
        {(title || subtitle) && (
          <header className="flex items-end justify-between px-6 pt-10 pb-6">
            <div>
              {subtitle && <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{subtitle}</p>}
              {title && <h1 className="mt-1 text-3xl text-foreground">{title}</h1>}
            </div>
            {action ?? (
              <Link
                to="/settings"
                className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft text-foreground/70"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
            )}
          </header>
        )}
        <main className="px-6">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-1/2 z-40 mb-4 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2">
        <div className="flex items-center justify-around rounded-full bg-foreground/95 px-2 py-2 shadow-soft backdrop-blur">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = path === to || (to !== "/home" && path.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex flex-col items-center gap-0.5 rounded-full px-3 py-2 text-[10px] transition ${
                  active ? "text-primary-foreground" : "text-primary-foreground/55"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-full bg-gradient-rose shadow-glow" aria-hidden />
                )}
                <Icon className={`relative h-5 w-5 ${active ? "" : ""}`} strokeWidth={active ? 2.2 : 1.6} />
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
