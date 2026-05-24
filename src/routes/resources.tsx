import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useRef, useState } from "react";
import { Wind, Snowflake, Heart, Play, Pause } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Care · Nova" },
      { name: "description", content: "Breathing exercises and gentle tips for hot flashes." },
    ],
  }),
  component: Resources,
});

const tips = [
  { icon: Snowflake, title: "Cool your pulse points", body: "A cold cloth on the inner wrists drops perceived temp within 60 seconds." },
  { icon: Wind, title: "Layer light, breathable linen", body: "Loose, natural fibres dissipate heat 3× faster than synthetics." },
  { icon: Heart, title: "Sip room-temp water", body: "Hydration steadies vasomotor swings better than icy drinks." },
];

function Resources() {
  return (
    <AppShell title="Care" subtitle="Gentle practices">
      <BreathingCard />

      <section className="mt-6">
        <h3 className="mb-3 px-1 text-sm font-medium text-foreground/70">Hot flash tips</h3>
        <div className="space-y-2">
          {tips.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-3xl bg-card p-5 shadow-soft">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-blush text-rose-gold">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl bg-gradient-night p-6 text-starlight shadow-soft">
        <p className="font-display text-2xl leading-snug">
          "This isn't an ending. It's a new sky — and you are its brightest star."
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.25em] text-starlight/50">— Nova</p>
      </section>
    </AppShell>
  );
}

function BreathingCard() {
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"In" | "Hold" | "Out">("In");
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const seq: { p: "In" | "Hold" | "Out"; ms: number }[] = [
      { p: "In", ms: 4000 }, { p: "Hold", ms: 7000 }, { p: "Out", ms: 8000 },
    ];
    let i = 0;
    const run = () => {
      setPhase(seq[i].p);
      tickRef.current = window.setTimeout(() => {
        i = (i + 1) % seq.length;
        run();
      }, seq[i].ms);
    };
    run();
    return () => { if (tickRef.current) clearTimeout(tickRef.current); };
  }, [playing]);

  const scale = phase === "In" ? 1 : phase === "Hold" ? 1 : 0.65;
  const duration = phase === "In" ? 4 : phase === "Hold" ? 7 : 8;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-night p-6 text-starlight shadow-soft">
      <p className="text-[11px] uppercase tracking-[0.25em] text-starlight/60">Breathing · 4·7·8</p>
      <p className="mt-1 font-display text-2xl">Cooling breath</p>

      <div className="relative my-8 grid h-56 place-items-center">
        <div
          className="absolute h-48 w-48 rounded-full bg-gradient-rose opacity-30 blur-2xl transition-transform ease-in-out"
          style={{ transform: `scale(${scale})`, transitionDuration: `${duration}s` }}
        />
        <div
          className="relative grid h-40 w-40 place-items-center rounded-full bg-gradient-rose shadow-glow transition-transform ease-in-out"
          style={{ transform: `scale(${scale})`, transitionDuration: `${duration}s` }}
        >
          <span className="font-display text-3xl text-primary-foreground">{playing ? phase : "Ready"}</span>
        </div>
      </div>

      <button
        onClick={() => setPlaying((p) => !p)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-starlight/10 py-3 text-sm text-starlight backdrop-blur"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {playing ? "Pause" : "Begin"}
      </button>
    </section>
  );
}
