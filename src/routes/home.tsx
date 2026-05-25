import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEpisodes, useProfile } from "@/lib/nova-store";
import { Bluetooth, Flame, Moon, Activity, ChevronRight } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Nova — Today" },
      { name: "description", content: "Your daily emotional state, hot flash count, sleep score and wristband status." },
    ],
  }),
  component: Home,
});

const emotions = [
  { id: "calm", label: "Calm", color: "oklch(0.78 0.08 160)", desc: "Steady and grounded" },
  { id: "stressed", label: "Stressed", color: "oklch(0.72 0.14 30)", desc: "Heightened arousal" },
  { id: "anxious", label: "Anxious", color: "oklch(0.62 0.12 290)", desc: "Restless heart rhythm" },
] as const;

function Home() {
  const { profile } = useProfile();
  const { episodes } = useEpisodes();

  const today = useMemo(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    return episodes.filter((e) => e.timestamp >= start.getTime() && e.type === "hot_flash").length;
  }, [episodes]);

  const emotion = emotions[0]; // mock: calm
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }, []);

  return (
    <AppShell
      subtitle={greeting}
      title={profile?.name ? `${profile.name.split(" ")[0]}.` : "Welcome."}
    >
      {/* Bluetooth chip */}
      <div className="mb-5 flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs shadow-soft w-fit">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <Bluetooth className="h-3.5 w-3.5 text-foreground/60" />
        <span className="text-foreground/70">Nova band connected · 84%</span>
      </div>

      {/* Emotional state hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-night p-6 text-starlight shadow-soft">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-rose opacity-30 blur-2xl" />
        <p className="text-[11px] uppercase tracking-[0.25em] text-starlight/60">Emotional state · now</p>
        <div className="mt-4 flex items-center gap-5">
          <div
            className="relative grid h-24 w-24 place-items-center rounded-full animate-float"
            style={{ background: `radial-gradient(circle at 30% 30%, ${emotion.color}, oklch(0.3 0.06 280))` }}
          >
            <div className="absolute inset-0 rounded-full ring-1 ring-starlight/20" />
            <span className="font-display text-2xl">{emotion.label}</span>
          </div>
          <div>
            <p className="font-display text-3xl leading-tight">You feel {emotion.label.toLowerCase()}.</p>
            <p className="mt-1 text-sm text-starlight/70">{emotion.desc}</p>
          </div>
        </div>
        <Link
          to="/monitor"
          className="mt-5 inline-flex items-center gap-1 text-sm text-rose-gold"
        >
          Open live monitor <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Stat cards */}
      <section className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={<Flame className="h-4 w-4" />} label="Hot flashes" value={today.toString()} unit="today" tone="rose" />
        <StatCard icon={<Moon className="h-4 w-4" />} label="Sleep score" value="82" unit="restful" tone="night" />
        <StatCard
          icon={<Activity className="h-4 w-4" />}
          label="Body temperature"
          value="36.7°"
          unit="↘ 0.2° vs morning"
          tone="blush"
          extra={<Sparkline />}
          className="col-span-2 lg:col-span-1"
        />
      </section>

      <section className="mt-6">
        <h3 className="mb-3 px-1 text-sm font-medium text-foreground/70">A gentle suggestion</h3>
        <Link
          to="/resources"
          className="flex items-center gap-4 rounded-3xl bg-card p-5 shadow-soft transition active:scale-[0.99]"
        >
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-blush">
            <span className="font-display text-xl text-rose-gold">4·7·8</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Cooling breath, 2 min</p>
            <p className="text-xs text-muted-foreground">Lowers core temp before bed</p>
          </div>
          <ChevronRight className="h-4 w-4 text-foreground/40" />
        </Link>
      </section>
    </AppShell>
  );
}

function StatCard({
  icon, label, value, unit, tone, extra, full, className,
}: {
  icon: React.ReactNode; label: string; value: string; unit: string;
  tone: "rose" | "night" | "blush"; extra?: React.ReactNode; full?: boolean; className?: string;
}) {
  const bg = tone === "rose" ? "bg-gradient-blush" : tone === "night" ? "bg-gradient-night text-starlight" : "bg-card";
  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 shadow-soft ${bg} ${full ? "col-span-2" : ""} ${className ?? ""}`}>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] opacity-70">
        {icon} {label}
      </div>
      <p className="mt-3 font-display text-4xl">{value}</p>
      <p className="mt-1 text-xs opacity-70">{unit}</p>
      {extra && <div className="mt-3">{extra}</div>}
    </div>
  );
}

function Sparkline() {
  const points = [36.4, 36.5, 36.8, 37.1, 37.0, 36.9, 36.7];
  const min = Math.min(...points) - 0.2;
  const max = Math.max(...points) + 0.2;
  const w = 280, h = 60;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="sl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.13 30)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.72 0.13 30)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#sl)" />
      <path d={path} fill="none" stroke="oklch(0.65 0.14 25)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
