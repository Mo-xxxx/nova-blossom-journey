import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useProfile, type WristbandSize } from "@/lib/nova-store";
import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile · Nova" },
      { name: "description", content: "Edit your Nova profile — name, age, and wristband preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [size, setSize] = useState<WristbandSize>("M");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAge(profile.age);
      setSize(profile.wristbandSize);
    }
  }, [profile]);

  const save = () => {
    setProfile({
      name: name || "Friend",
      age: typeof age === "number" ? age : 50,
      wristbandSize: size,
      calibrated: profile?.calibrated ?? true,
      onboarded: true,
    });
    toast.success("Profile updated");
    nav({ to: "/settings" });
  };

  return (
    <AppShell
      title="Profile"
      subtitle="Your details"
      action={
        <button onClick={() => nav({ to: "/settings" })} className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </button>
      }
    >
      <section className="rounded-3xl bg-gradient-night p-6 text-starlight shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-rose font-display text-2xl text-primary-foreground shadow-glow">
            {(name || "N")[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-display text-2xl">{name || "Friend"}</p>
            <p className="text-xs text-starlight/60">Nova member</p>
          </div>
        </div>
      </section>

      <div className="mt-6 space-y-5 rounded-3xl bg-card p-5 shadow-soft">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maya"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-rose-gold"
          />
        </Field>
        <Field label="Age">
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
            placeholder="52"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-rose-gold"
          />
        </Field>
        <Field label="Wristband size">
          <div className="grid grid-cols-3 gap-3">
            {(["S", "M", "L"] as WristbandSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-4 transition ${
                  size === s
                    ? "border-rose-gold bg-gradient-rose text-primary-foreground shadow-glow"
                    : "border-border bg-background text-foreground/70"
                }`}
              >
                <span className="font-display text-2xl">{s}</span>
                <span className="text-[10px] uppercase tracking-widest">
                  {s === "S" ? "140–160" : s === "M" ? "160–180" : "180–210"}
                </span>
              </button>
            ))}
          </div>
        </Field>
      </div>

      <button
        onClick={save}
        className="mt-6 mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-rose py-4 text-base font-medium text-primary-foreground shadow-glow"
      >
        <Check className="h-4 w-4" /> Save changes
      </button>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-[0.2em] text-rose-gold">{label}</p>
      {children}
    </div>
  );
}
