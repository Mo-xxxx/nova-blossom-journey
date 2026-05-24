import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAppointments, type AppointmentKind } from "@/lib/nova-appointments";
import { CalendarHeart, Bell, Stethoscope, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Calendar · Nova" },
      { name: "description", content: "Schedule doctor's appointments and gentle reminders for your menopause care." },
    ],
  }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { items, add, remove } = useAppointments();
  const [open, setOpen] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const { upcoming, past } = useMemo(() => {
    const up = items.filter((i) => i.date >= today);
    const pa = items.filter((i) => i.date < today);
    return { upcoming: up, past: pa };
  }, [items, today]);

  return (
    <AppShell title="Calendar" subtitle="Your care schedule">
      <section className="rounded-3xl bg-gradient-night p-6 text-starlight shadow-soft">
        <div className="flex items-start gap-3">
          <CalendarHeart className="mt-1 h-5 w-5 text-rose-gold" />
          <div>
            <p className="font-display text-2xl leading-tight">A gentle rhythm of care.</p>
            <p className="mt-1 text-sm text-starlight/70">Track doctor visits and quiet reminders that move with you.</p>
          </div>
        </div>
      </section>

      <button
        onClick={() => setOpen(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-rose py-4 text-sm font-medium text-primary-foreground shadow-glow"
      >
        <Plus className="h-4 w-4" /> Add appointment or reminder
      </button>

      <Group title="Upcoming" empty="Nothing scheduled yet.">
        {upcoming.map((a) => (
          <Item key={a.id} appt={a} onDelete={() => { remove(a.id); toast("Removed"); }} />
        ))}
      </Group>

      {past.length > 0 && (
        <Group title="Past">
          {past.map((a) => (
            <Item key={a.id} appt={a} onDelete={() => remove(a.id)} muted />
          ))}
        </Group>
      )}

      {open && (
        <AddSheet
          onClose={() => setOpen(false)}
          onSave={(a) => {
            add(a);
            setOpen(false);
            toast.success(a.kind === "doctor" ? "Appointment scheduled" : "Reminder set");
          }}
        />
      )}
    </AppShell>
  );
}

function Group({ title, children, empty }: { title: string; children: React.ReactNode; empty?: string }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <section className="mt-6">
      <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      {hasChildren ? (
        <div className="space-y-2">{children}</div>
      ) : (
        <div className="rounded-3xl bg-card p-5 text-center text-sm text-muted-foreground shadow-soft">{empty}</div>
      )}
    </section>
  );
}

function Item({
  appt,
  onDelete,
  muted,
}: {
  appt: ReturnType<typeof useAppointments>["items"][number];
  onDelete: () => void;
  muted?: boolean;
}) {
  const Icon = appt.kind === "doctor" ? Stethoscope : Bell;
  const date = new Date(`${appt.date}T${appt.time}`);
  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft ${muted ? "opacity-60" : ""}`}>
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-rose text-primary-foreground shadow-glow">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{appt.title}</p>
        <p className="text-xs text-muted-foreground">
          {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {appt.time}
          {appt.with ? ` · ${appt.with}` : ""}
        </p>
        {appt.notes && <p className="mt-0.5 truncate text-xs text-foreground/60">{appt.notes}</p>}
      </div>
      <button
        onClick={onDelete}
        aria-label="Delete"
        className="grid h-8 w-8 place-items-center rounded-full text-foreground/40 transition hover:bg-muted hover:text-foreground"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function AddSheet({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (a: {
    title: string;
    kind: AppointmentKind;
    date: string;
    time: string;
    notes?: string;
    with?: string;
  }) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [kind, setKind] = useState<AppointmentKind>("doctor");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("10:00");
  const [withWho, setWithWho] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      kind,
      date,
      time,
      with: withWho.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 px-4 pb-4 pt-20 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-background p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-xl">New {kind === "doctor" ? "appointment" : "reminder"}</p>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground/60">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {(["doctor", "reminder"] as AppointmentKind[]).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm capitalize transition ${
                kind === k
                  ? "border-rose-gold bg-gradient-rose text-primary-foreground shadow-glow"
                  : "border-border bg-card text-foreground/70"
              }`}
            >
              {k === "doctor" ? <Stethoscope className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              {k}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={kind === "doctor" ? "Menopause check-in" : "Evening magnesium"}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none focus:border-rose-gold"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none focus:border-rose-gold"
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none focus:border-rose-gold"
              />
            </Field>
          </div>
          {kind === "doctor" && (
            <Field label="With">
              <input
                value={withWho}
                onChange={(e) => setWithWho(e.target.value)}
                placeholder="Dr. Amara Patel"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none focus:border-rose-gold"
              />
            </Field>
          )}
          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Optional"
              className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-rose-gold"
            />
          </Field>
        </div>

        <button
          onClick={submit}
          disabled={!title.trim()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-rose py-4 text-base font-medium text-primary-foreground shadow-glow disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-rose-gold">{label}</p>
      {children}
    </div>
  );
}
