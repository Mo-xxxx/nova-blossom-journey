import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { FileDown, Share2, TrendingDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights · Nova" },
      { name: "description", content: "Weekly and monthly trend charts plus a shareable doctor report." },
    ],
  }),
  component: Insights,
});

const weekData = [
  { d: "Mon", flashes: 4, sleep: 78 },
  { d: "Tue", flashes: 6, sleep: 72 },
  { d: "Wed", flashes: 3, sleep: 84 },
  { d: "Thu", flashes: 5, sleep: 70 },
  { d: "Fri", flashes: 2, sleep: 88 },
  { d: "Sat", flashes: 3, sleep: 85 },
  { d: "Sun", flashes: 1, sleep: 91 },
];

const monthData = Array.from({ length: 30 }, (_, i) => ({
  d: i + 1,
  temp: 36.5 + Math.sin(i / 4) * 0.4 + (i % 7 === 0 ? 0.3 : 0),
}));

function Insights() {
  const [range, setRange] = useState<"week" | "month">("week");

  return (
    <AppShell title="Insights" subtitle="Patterns">
      <div className="mb-5 inline-flex rounded-full bg-card p-1 shadow-soft">
        {(["week", "month"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-full px-5 py-1.5 text-xs font-medium capitalize transition ${
              range === r ? "bg-gradient-rose text-primary-foreground shadow-glow" : "text-foreground/60"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <section className="rounded-3xl bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Hot flashes</p>
            <p className="mt-1 font-display text-3xl">24 <span className="text-base text-muted-foreground">this {range}</span></p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
            <TrendingDown className="h-3.5 w-3.5" /> 18%
          </div>
        </div>
        <div className="mt-4 h-44">
          <ResponsiveContainer>
            <BarChart data={weekData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="oklch(0.93 0.01 40)" vertical={false} />
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "oklch(0.5 0.03 270)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "oklch(0.5 0.03 270)" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Bar dataKey="flashes" radius={[8, 8, 4, 4]} fill="oklch(0.72 0.13 30)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-4 rounded-3xl bg-gradient-night p-5 text-starlight shadow-soft">
        <p className="text-[11px] uppercase tracking-[0.18em] text-starlight/60">Body temperature · 30 days</p>
        <p className="mt-1 font-display text-2xl">Stable baseline</p>
        <div className="mt-3 h-40">
          <ResponsiveContainer>
            <LineChart data={monthData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.08)" vertical={false} />
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(1 0 0 / 0.5)" }} />
              <YAxis domain={[36, 37.5]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(1 0 0 / 0.5)" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", background: "oklch(0.22 0.04 275)", color: "white" }} />
              <Line type="monotone" dataKey="temp" stroke="oklch(0.78 0.12 30)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-4 rounded-3xl bg-gradient-blush p-5 shadow-soft">
        <p className="font-display text-xl">Share with your doctor</p>
        <p className="mt-1 text-sm text-foreground/60">
          A clean PDF with 30 days of episodes, sleep, HRV and temperature.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => toast.success("Report prepared")}
            className="flex items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-medium text-background"
          >
            <FileDown className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => toast.success("Link copied")}
            className="flex items-center justify-center gap-2 rounded-full bg-card py-3 text-sm font-medium text-foreground"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
      </section>
    </AppShell>
  );
}
