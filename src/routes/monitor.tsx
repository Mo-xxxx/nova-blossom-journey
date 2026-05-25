import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Heart, Thermometer, Sparkles } from "lucide-react";

export const Route = createFileRoute("/monitor")({
  head: () => ({
    meta: [
      { title: "Live Monitor · Nova" },
      { name: "description", content: "Real-time P6 and HT4 acupoint readings with body temperature and emotion detection." },
    ],
  }),
  component: Monitor,
});

interface Reading { t: number; p6: number; ht4: number; temp: number; }

function Monitor() {
  const [data, setData] = useState<Reading[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      t: i,
      p6: 62 + Math.sin(i / 3) * 6 + (i % 5),
      ht4: 58 + Math.cos(i / 4) * 5 + ((i * 2) % 4),
      temp: 36.6 + Math.sin(i / 6) * 0.4,
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => {
        const next = d.slice(1);
        const last = d[d.length - 1];
        next.push({
          t: last.t + 1,
          p6: Math.max(50, Math.min(90, last.p6 + (Math.random() - 0.5) * 6)),
          ht4: Math.max(50, Math.min(85, last.ht4 + (Math.random() - 0.5) * 5)),
          temp: Math.max(36.2, Math.min(37.6, last.temp + (Math.random() - 0.5) * 0.15)),
        });
        return next;
      });
    }, 1100);
    return () => clearInterval(id);
  }, []);

  const latest = data[data.length - 1];
  const emotion = latest.p6 > 75 ? "Stressed" : latest.p6 > 68 ? "Alert" : "Calm";
  const emotionColor = emotion === "Stressed" ? "oklch(0.7 0.15 25)" : emotion === "Alert" ? "oklch(0.78 0.12 80)" : "oklch(0.75 0.1 170)";

  return (
    <AppShell title="Live monitor" subtitle="Real-time">
      {/* Hero orb */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-night p-6 text-starlight shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-starlight/60">Emotion detected</p>
            <p className="mt-2 font-display text-4xl">{emotion}</p>
            <p className="mt-1 text-xs text-starlight/60">From P6 · HT4 HRV pattern</p>
          </div>
          <div
            className="grid h-28 w-28 place-items-center rounded-full animate-pulse-glow"
            style={{ background: `radial-gradient(circle at 30% 30%, ${emotionColor}, oklch(0.22 0.04 275))` }}
          >
            <Sparkles className="h-8 w-8 text-starlight" />
          </div>
        </div>
      </div>

      {/* Node readings */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <NodeCard
          name="P6"
          subtitle="Inner wrist · Neiguan"
          value={Math.round(latest.p6)}
          unit="bpm·var"
        />
        <NodeCard
          name="HT4"
          subtitle="Heart meridian · Lingdao"
          value={Math.round(latest.ht4)}
          unit="bpm·var"
        />
      </div>

      {/* Temp chart */}
      <div className="mt-4 rounded-3xl bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/60">
            <Thermometer className="h-3.5 w-3.5" /> Body temperature
          </div>
          <p className="font-display text-2xl">{latest.temp.toFixed(2)}°</p>
        </div>
        <div className="mt-3 h-40">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="tg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.13 30)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="oklch(0.72 0.13 30)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis domain={[36, 37.8]} hide />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 30px -12px rgba(0,0,0,0.2)" }}
                labelFormatter={() => ""}
                formatter={(v: number) => [`${v.toFixed(2)}°C`, "Temp"]}
              />
              <Area type="monotone" dataKey="temp" stroke="oklch(0.65 0.14 25)" strokeWidth={2.5} fill="url(#tg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3 text-xs text-secondary-foreground">
        <Heart className="h-4 w-4" />
        <span>Nova is listening softly. Tap your band twice to log a flash.</span>
      </div>
    </AppShell>
  );
}

function NodeCard({ name, subtitle, value, unit }: { name: string; subtitle: string; value: number; unit: string; }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-blush p-5 shadow-soft">
      <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-gradient-rose text-[11px] font-medium text-primary-foreground shadow-glow">
        {name}
      </div>
      <p className="mt-6 font-display text-4xl text-foreground">{value}</p>
      <p className="text-[11px] uppercase tracking-widest text-foreground/50">{unit}</p>
      <p className="mt-3 text-xs text-foreground/60">{subtitle}</p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full bg-gradient-rose transition-all duration-700"
          style={{ width: `${Math.min(100, ((value - 50) / 40) * 100)}%` }}
        />
      </div>
    </div>
  );
}
