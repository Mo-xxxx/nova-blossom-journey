import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Activity, BookHeart, Sparkles, Settings, Flower2 } from "lucide-react";
import type { ReactNode } from "react";
import { NovaLogo } from "@/components/NovaLogo";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/monitor", label: "Live", icon: Activity },
  { to: "/log", label: "Log", icon: BookHeart },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/resources", label: "Care", icon: Flower2 },
] as const;

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function isItemActive(path: string, to: string) {
  return path === to || (to !== "/home" && path.startsWith(to));
}

export function AppShell({ children, title, subtitle, action }: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const path = useActivePath();

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col lg:border-r lg:border-border/60 lg:bg-card/40 lg:px-5 lg:py-8 lg:backdrop-blur">
        <Link to="/home" className="flex items-center gap-3">
          <NovaLogo size={40} />
          <div>
            <p className="font-display text-2xl leading-none">nova</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Your new sky</p>
          </div>
        </Link>

        <nav className="mt-10 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = isItemActive(path, to);
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition ${
                  active ? "text-primary-foreground" : "text-foreground/70 hover:bg-card"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-full bg-gradient-rose shadow-glow" aria-hidden />
                )}
                <Icon className="relative h-4 w-4" strokeWidth={active ? 2.2 : 1.6} />
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          to="/settings"
          className="mt-auto flex items-center gap-3 rounded-full px-4 py-2.5 text-sm text-foreground/70 hover:bg-card"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </aside>

      {/* Content */}
      <div className="flex-1 pb-28 lg:pb-10 lg:pl-64">
        <div className="mx-auto w-full max-w-md md:max-w-2xl lg:max-w-5xl">
          {(title || subtitle) && (
            <header className="flex items-end justify-between px-6 pt-10 pb-6 md:px-10 md:pt-14 md:pb-8 lg:px-12">
              <div>
                {subtitle && <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{subtitle}</p>}
                {title && <h1 className="mt-1 text-3xl text-foreground md:text-4xl lg:text-5xl">{title}</h1>}
              </div>
              {action ?? (
                <Link
                  to="/settings"
                  className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft text-foreground/70 lg:hidden"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              )}
            </header>
          )}
          <main className="px-6 md:px-10 lg:px-12">{children}</main>
        </div>
      </div>

      {/* Mobile + tablet bottom nav */}
      <nav className="fixed bottom-0 left-1/2 z-40 mb-4 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 lg:hidden">
        <div className="flex items-center justify-around rounded-full bg-foreground/95 px-2 py-2 shadow-soft backdrop-blur">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = isItemActive(path, to);
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
                <Icon className="relative h-5 w-5" strokeWidth={active ? 2.2 : 1.6} />
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
