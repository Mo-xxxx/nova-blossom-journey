import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NovaLogo } from "@/components/NovaLogo";
import { saveProfile, type WristbandSize } from "@/lib/nova-store";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to Nova" },
      { name: "description", content: "Set up your Nova wristband and personalize your care." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [size, setSize] = useState<WristbandSize>("M");

  const next = () => setStep((s) => s + 1);
  const finish = () => {
    saveProfile({
      name: name || "Friend",
      age: typeof age === "number" ? age : 50,
      wristbandSize: size,
      calibrated: true,
      onboarded: true,
    });
    toast.success("You're glowing. Welcome to Nova.");
    nav({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-gradient-night text-starlight">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        {/* Star field */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-[2px] w-[2px] rounded-full bg-starlight"
              style={{
                top: `${(i * 37) % 100}%`,
                left: `${(i * 53) % 100}%`,
                opacity: 0.3 + ((i * 7) % 70) / 100,
              }}
            />
          ))}
        </div>

        <div className="relative flex items-center gap-3">
          <NovaLogo size={40} />
          <div>
            <p className="font-display text-2xl leading-none">nova</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-starlight/60">new beginnings</p>
          </div>
        </div>

        <div className="relative mt-10 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-gradient-rose" : "bg-starlight/15"}`}
            />
          ))}
        </div>

        <div className="relative mt-12 flex-1">
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="font-display text-4xl leading-tight">
                Your new beginning, <em className="not-italic text-rose-gold">understood.</em>
              </h2>
              <p className="text-starlight/70">
                Nova quietly pairs with your wristband to learn the language of your body — hot flashes, sleep, and emotion — so you can feel yourself again.
              </p>
              <Stat label="What's your name?" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maya"
                className="w-full rounded-2xl border border-starlight/15 bg-starlight/5 px-5 py-4 text-lg text-starlight placeholder:text-starlight/30 outline-none focus:border-rose-gold"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display text-3xl">A little about you</h2>
              <p className="text-starlight/60">Age helps Nova tune insights to your stage.</p>
              <Stat label="Age" />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                placeholder="52"
                className="w-full rounded-2xl border border-starlight/15 bg-starlight/5 px-5 py-4 text-lg text-starlight placeholder:text-starlight/30 outline-none focus:border-rose-gold"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-3xl">Pick your wristband size</h2>
              <p className="text-starlight/60">You'll find your size on the inside of the band's clasp.</p>
              <div className="grid grid-cols-3 gap-3">
                {(["S", "M", "L"] as WristbandSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-6 transition ${
                      size === s
                        ? "border-rose-gold bg-gradient-rose text-primary-foreground shadow-glow"
                        : "border-starlight/15 bg-starlight/5 text-starlight/80"
                    }`}
                  >
                    <span className="font-display text-3xl">{s}</span>
                    <span className="text-[11px] uppercase tracking-widest">
                      {s === "S" ? "140–160mm" : s === "M" ? "160–180mm" : "180–210mm"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-3xl">Calibrate your doctor node</h2>
              <p className="text-starlight/70">
                Align the rose-gold sensor with the glowing point below — your P6 acupoint. Hold still for 30 seconds.
              </p>

              <div className="rounded-3xl border border-starlight/15 bg-starlight/5 p-5">
                <div className="relative mx-auto w-52">
                  <svg viewBox="0 0 180 240" className="h-auto w-full" fill="none">
                    <defs>
                      <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="hsl(25 45% 88%)" />
                        <stop offset="100%" stopColor="hsl(20 35% 74%)" />
                      </linearGradient>
                      <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="hsl(15 80% 72%)" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="hsl(15 80% 72%)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="hsl(15 80% 72%)" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    {/* Palm */}
                    <path
                      d="M55 30 Q50 10 70 8 Q75 0 85 6 Q92 0 100 6 Q110 0 115 10 Q130 12 128 32 L130 60 Q132 70 128 80 L125 95 L55 95 L52 80 Q48 70 50 60 Z"
                      fill="url(#skin)" stroke="hsl(20 30% 58%)" strokeWidth="1"
                    />
                    {/* Wrist creases */}
                    <path d="M55 95 Q90 100 125 95" stroke="hsl(20 30% 52%)" strokeWidth="1" opacity="0.6" />
                    <path d="M58 102 Q90 107 122 102" stroke="hsl(20 30% 52%)" strokeWidth="0.8" opacity="0.4" />
                    {/* Forearm */}
                    <path
                      d="M55 95 L60 230 Q90 238 120 230 L125 95 Z"
                      fill="url(#skin)" stroke="hsl(20 30% 58%)" strokeWidth="1"
                    />
                    {/* Two-finger guide */}
                    <line x1="90" y1="103" x2="90" y2="138" stroke="hsl(var(--rose-gold, 25 60% 60%))" strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />
                    <text x="96" y="124" fill="hsl(var(--rose-gold, 25 60% 60%))" fontSize="9" fontFamily="sans-serif">2 fingers</text>
                    {/* P6 glow */}
                    <circle cx="90" cy="142" r="30" fill="url(#glow)">
                      <animate attributeName="r" values="26;34;26" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="90" cy="142" r="7" fill="hsl(var(--rose-gold, 25 60% 60%))" />
                    <circle cx="90" cy="142" r="2.5" fill="hsl(40 95% 92%)" />
                    {/* Label */}
                    <line x1="97" y1="142" x2="138" y2="168" stroke="hsl(var(--rose-gold, 25 60% 60%))" strokeWidth="1" opacity="0.8" />
                    <text x="140" y="172" fill="hsl(var(--rose-gold, 25 60% 60%))" fontSize="12" fontFamily="serif" fontStyle="italic">P6</text>
                  </svg>
                </div>
                <p className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] uppercase tracking-[0.25em] text-starlight/70">
                  <Check className="h-3 w-3 text-rose-gold" /> Place node here
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="relative mt-8">
          <button
            disabled={(step === 0 && !name) || (step === 1 && !age)}
            onClick={() => (step === 3 ? finish() : next())}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-rose px-6 py-4 text-base font-medium text-primary-foreground shadow-glow transition disabled:opacity-40"
          >
            {step === 3 ? "Enter Nova" : "Continue"}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mt-3 w-full text-center text-xs uppercase tracking-[0.2em] text-starlight/50"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label }: { label: string }) {
  return <p className="text-[11px] uppercase tracking-[0.25em] text-rose-gold">{label}</p>;
}
