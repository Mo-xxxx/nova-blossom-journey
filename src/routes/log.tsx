import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEpisodes, type Episode } from "@/lib/nova-store";
import { useMemo, useState } from "react";
import { Flame, Plus, NotebookPen } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/log")({
  head: () => ({
    meta: [
      { title: "Episode Log · Nova" },
      { name: "description", content: "Auto-logged hot flashes, symptom journal and your monthly calendar." },
    ],
  }),
  component: LogPage,
});

function LogPage() {
  const { episodes, add } = useEpisodes();
  const [note, setNote] = useState("");
  const [intensity, setIntensity] = useState(3);

  const submit = () => {
    add({ timestamp: Date.now(), type: "manual", intensity, note: note || undefined });
    setNote("");
    setIntensity(3);
    toast.success("Logged. Nova is here with you.");
  };

  const month = useMemo(() => buildMonth(episodes), [episodes]);

  return (
    <AppShell title="Your story" subtitle="Episode log">
      {/* Monthly calendar */}
      <section className="rounded-3xl bg-card p-5 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-lg">
            {new Date().toLocaleString("en", { month: "long", year: "numeric" })}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Heat map</p>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-muted-foreground">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {month.cells.map((c, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg text-[10px] grid place-items-center"
              style={{
                background: c.day
                  ? c.count > 0
                    ? `oklch(${0.95 - Math.min(c.count, 5) * 0.08} ${0.04 + Math.min(c.count, 5) * 0.02} 25)`
                    : "oklch(0.97 0.01 40)"
                  : "transparent",
                color: c.count > 2 ? "white" : "oklch(0.35 0.04 270)",
              }}
            >
              {c.day ?? ""}
            </div>
          ))}
        </div>
      </section>

      {/* Manual journal */}
      <section className="mt-5 rounded-3xl bg-gradient-blush p-5 shadow-soft">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/60">
          <NotebookPen className="h-3.5 w-3.5" /> Symptom journal
        </div>
        <p className="mt-2 font-display text-xl">How are you feeling?</p>
        <div className="mt-4 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setIntensity(n)}
              className={`flex-1 rounded-2xl py-3 text-sm transition ${
                intensity === n
                  ? "bg-gradient-rose text-primary-foreground shadow-glow"
                  : "bg-card text-foreground/70"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="A few words for your future self…"
          className="mt-3 w-full resize-none rounded-2xl border-none bg-card px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
          rows={3}
        />
        <button
          onClick={submit}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-medium text-background"
        >
          <Plus className="h-4 w-4" /> Log entry
        </button>
      </section>

      {/* Timeline */}
      <section className="mt-6">
        <h3 className="mb-3 px-1 text-sm font-medium text-foreground/70">Recent episodes</h3>
        <div className="space-y-2">
          {episodes.slice(0, 12).map((e) => (
            <EpisodeRow key={e.id} e={e} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function EpisodeRow({ e }: { e: Episode }) {
  const auto = e.type === "hot_flash";
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${auto ? "bg-gradient-rose text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
        {auto ? <Flame className="h-4 w-4" /> : <NotebookPen className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{auto ? "Hot flash" : "Journal entry"}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(e.timestamp).toLocaleString("en", { weekday: "short", hour: "numeric", minute: "2-digit" })}
          {e.duration ? ` · ${e.duration} min` : ""}
        </p>
        {e.note && <p className="mt-1 text-xs italic text-foreground/60">"{e.note}"</p>}
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`h-4 w-1 rounded-full ${i < e.intensity ? "bg-gradient-rose" : "bg-muted"}`} />
        ))}
      </div>
    </div>
  );
}

function buildMonth(episodes: Episode[]) {
  const now = new Date();
  const year = now.getFullYear(); const month = now.getMonth();
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const lead = first.getDay();
  const counts = new Map<number, number>();
  episodes.forEach((e) => {
    const d = new Date(e.timestamp);
    if (d.getFullYear() === year && d.getMonth() === month) {
      counts.set(d.getDate(), (counts.get(d.getDate()) ?? 0) + 1);
    }
  });
  const cells: { day: number | null; count: number }[] = [];
  for (let i = 0; i < lead; i++) cells.push({ day: null, count: 0 });
  for (let d = 1; d <= days; d++) cells.push({ day: d, count: counts.get(d) ?? 0 });
  return { cells };
}
