import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import handImg from "@/assets/p6-hand.png";
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
                Nova quietly pairs with your wristband to learn the language of your body, hot flashes, sleep, and emotion so you can feel yourself again.
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
                Align the sensor with the glowing point below. Hold still for 30 seconds.
              </p>

              <div className="rounded-3xl border border-starlight/15 bg-starlight/5 p-5">
                <div className="relative mx-auto w-56">
                  <img
                    src={handImg}
                    alt="Inner wrist showing the P6 acupoint location"
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-auto w-full rounded-2xl"
                  />
                  {/* P6 label */}
                  <div className="absolute right-2 top-1/2 text-rose-gold items-center justify-start gap-[10px] flex flex-row py-[20px]">
                    <span className="h-px w-8 bg-rose-gold/60" />
                    <span className="font-display text-sm italic">P6</span>
                  </div>
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
