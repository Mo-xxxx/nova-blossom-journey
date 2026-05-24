import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useProfile, saveProfile } from "@/lib/nova-store";
import { Bluetooth, Bell, User, ChevronRight, LogOut, ShieldCheck, CalendarHeart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Nova" },
      { name: "description", content: "Manage Bluetooth pairing, notifications and your profile." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile } = useProfile();
  const nav = useNavigate();
  const [notif, setNotif] = useState(true);
  const [paired, setPaired] = useState(true);

  return (
    <AppShell title="Settings" subtitle="Your Nova" action={<span />}>
      {/* Profile card */}
      <section className="overflow-hidden rounded-3xl bg-gradient-night p-6 text-starlight shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-rose font-display text-xl text-primary-foreground shadow-glow">
            {profile?.name?.[0]?.toUpperCase() ?? "N"}
          </div>
          <div>
            <p className="font-display text-xl">{profile?.name ?? "Friend"}</p>
            <p className="text-xs text-starlight/60">Age {profile?.age ?? "—"} · Band size {profile?.wristbandSize ?? "M"}</p>
          </div>
        </div>
      </section>

      <Section title="Device">
        <Row
          icon={<Bluetooth className="h-4 w-4" />}
          title="Nova wristband"
          subtitle={paired ? "Connected · 84% battery" : "Disconnected"}
          right={
            <Toggle on={paired} onChange={(v) => { setPaired(v); toast(v ? "Re-paired" : "Disconnected"); }} />
          }
        />
        <Row
          icon={<ShieldCheck className="h-4 w-4" />}
          title="Re-calibrate doctor node"
          subtitle="Last calibrated today"
          right={<ChevronRight className="h-4 w-4 text-foreground/30" />}
          onClick={() => toast("Hold band still for 30 sec…")}
        />
      </Section>

      <Section title="Care schedule">
        <Row
          icon={<CalendarHeart className="h-4 w-4" />}
          title="Appointments & reminders"
          subtitle="Doctor visits, daily rituals"
          right={<ChevronRight className="h-4 w-4 text-foreground/30" />}
          onClick={() => nav({ to: "/appointments" })}
        />
      </Section>

      <Section title="Notifications">
        <Row
          icon={<Bell className="h-4 w-4" />}
          title="Gentle alerts"
          subtitle="Episode detected · daily summary"
          right={<Toggle on={notif} onChange={setNotif} />}
        />
      </Section>

      <Section title="Profile">
        <Row
          icon={<User className="h-4 w-4" />}
          title="Edit profile"
          subtitle="Name, age, preferences"
          right={<ChevronRight className="h-4 w-4 text-foreground/30" />}
          onClick={() => nav({ to: "/profile" })}
        />
      </Section>

      <button
        onClick={() => {
          if (profile) saveProfile({ ...profile, onboarded: false });
          nav({ to: "/onboarding" });
        }}
        className="mt-6 mb-2 flex w-full items-center justify-center gap-2 rounded-full bg-card py-4 text-sm text-foreground/70 shadow-soft"
      >
        <LogOut className="h-4 w-4" /> Reset onboarding
      </button>

      <p className="mb-4 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Nova · feel yourself again
      </p>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      <div className="overflow-hidden rounded-3xl bg-card shadow-soft">{children}</div>
    </section>
  );
}

function Row({
  icon, title, subtitle, right, onClick,
}: { icon: React.ReactNode; title: string; subtitle?: string; right?: React.ReactNode; onClick?: () => void; }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-5 py-4 text-left transition active:bg-muted/60 border-b border-border last:border-b-0">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </button>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <span
      role="switch"
      aria-checked={on}
      onClick={(e) => { e.stopPropagation(); onChange(!on); }}
      className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition ${on ? "bg-gradient-rose shadow-glow" : "bg-muted"}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? "translate-x-6" : "translate-x-1"}`} />
    </span>
  );
}
