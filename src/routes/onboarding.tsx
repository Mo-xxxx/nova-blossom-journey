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
                  <svg viewBox="0 0 200 340" className="h-auto w-full" fill="none">
                    <defs>
                      <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="hsl(25 50% 90%)" />
                        <stop offset="100%" stopColor="hsl(20 38% 76%)" />
                      </linearGradient>
                      <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="hsl(15 80% 72%)" stopOpacity="0.95" />
                        <stop offset="60%" stopColor="hsl(15 80% 72%)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="hsl(15 80% 72%)" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Fingers (palm-up, left hand) — long and slender */}
                    {/* Index */}
                    <path d="M62 115 Q58 70 60 35 Q61 22 70 22 Q79 22 79 35 Q80 72 76 115 Z"
                      fill="url(#skin)" stroke="hsl(20 30% 58%)" strokeWidth="0.8" />
                    {/* Middle (longest) */}
                    <path d="M84 115 Q82 60 84 22 Q85 8 94 8 Q104 8 104 22 Q105 60 101 115 Z"
                      fill="url(#skin)" stroke="hsl(20 30% 58%)" strokeWidth="0.8" />
                    {/* Ring */}
                    <path d="M108 115 Q107 65 110 30 Q111 17 119 17 Q128 17 128 30 Q130 67 125 115 Z"
                      fill="url(#skin)" stroke="hsl(20 30% 58%)" strokeWidth="0.8" />
                    {/* Pinky (shortest) */}
                    <path d="M131 118 Q132 85 136 55 Q138 44 146 44 Q154 45 153 56 Q151 88 147 118 Z"
                      fill="url(#skin)" stroke="hsl(20 30% 58%)" strokeWidth="0.8" />

                    {/* Thumb on right (left hand, palm up) */}
                    <path d="M152 130 Q175 118 180 92 Q182 80 173 76 Q162 74 156 88 Q150 108 148 128 Z"
                      fill="url(#skin)" stroke="hsl(20 30% 58%)" strokeWidth="0.8" />

                    {/* Palm */}
                    <path d="M55 130 Q55 115 70 115 L150 115 Q160 115 162 132 L160 185 Q160 195 150 195 L62 195 Q52 195 52 185 Z"
                      fill="url(#skin)" stroke="hsl(20 30% 58%)" strokeWidth="1" />

                    {/* Palm crease lines */}
                    <path d="M70 140 Q105 150 150 138" stroke="hsl(20 30% 55%)" strokeWidth="0.6" opacity="0.45" />
                    <path d="M72 158 Q108 168 148 156" stroke="hsl(20 30% 55%)" strokeWidth="0.6" opacity="0.4" />

                    {/* Wrist crease */}
                    <path d="M58 192 Q105 200 158 192" stroke="hsl(20 30% 52%)" strokeWidth="1" opacity="0.7" />
                    <path d="M60 200 Q105 207 156 200" stroke="hsl(20 30% 52%)" strokeWidth="0.8" opacity="0.45" />

                    {/* Forearm */}
                    <path d="M58 195 L66 330 Q105 338 144 330 L152 195 Z"
                      fill="url(#skin)" stroke="hsl(20 30% 58%)" strokeWidth="1" />

                    {/* Tendon hints framing P6 */}
                    <path d="M95 205 Q93 240 96 275" stroke="hsl(20 30% 60%)" strokeWidth="0.5" opacity="0.35" />
                    <path d="M115 205 Q117 240 114 275" stroke="hsl(20 30% 60%)" strokeWidth="0.5" opacity="0.35" />

                    {/* 3-finger measurement guide */}
                    <line x1="105" y1="200" x2="105" y2="240" stroke="hsl(var(--rose-gold, 25 60% 60%))" strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />
                    <text x="112" y="224" fill="hsl(var(--rose-gold, 25 60% 60%))" fontSize="9" fontFamily="sans-serif">3 fingers</text>

                    {/* P6 glow */}
                    <circle cx="105" cy="245" r="32" fill="url(#glow)">
                      <animate attributeName="r" values="28;36;28" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="105" cy="245" r="7.5" fill="hsl(var(--rose-gold, 25 60% 60%))" />
                    <circle cx="105" cy="245" r="2.5" fill="hsl(40 95% 92%)" />

                    {/* P6 label */}
                    <line x1="113" y1="245" x2="158" y2="272" stroke="hsl(var(--rose-gold, 25 60% 60%))" strokeWidth="1" opacity="0.8" />
                    <text x="160" y="276" fill="hsl(var(--rose-gold, 25 60% 60%))" fontSize="12" fontFamily="serif" fontStyle="italic">P6</text>
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
