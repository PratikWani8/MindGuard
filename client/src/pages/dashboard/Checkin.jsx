import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Frown, Meh, Smile, Laugh, Angry, ArrowRight, ArrowLeft, CheckCircle2, Moon, Zap, Focus, Flame } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import { submitCheckin } from "../../services/checkinApi";
import { cn } from "../../utils/cn";

const moods = [
  { value: 1, label: "Very low", icon: Angry, color: "text-red-500 bg-red-50" },
  { value: 2, label: "Low", icon: Frown, color: "text-orange-500 bg-orange-50" },
  { value: 3, label: "Neutral", icon: Meh, color: "text-amber-500 bg-amber-50" },
  { value: 4, label: "Good", icon: Smile, color: "text-emerald-500 bg-emerald-50" },
  { value: 5, label: "Very good", icon: Laugh, color: "text-cyan-500 bg-cyan-50" },
];

function SliderField({ icon: Icon, label, value, onChange, min = 0, max = 10, hint }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-9 w-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
          <Icon size={17} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-800">{label}</p>
          {hint && <p className="text-xs text-ink-400">{hint}</p>}
        </div>
        <span className="ml-auto font-display font-semibold text-violet-600">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-500 h-2 rounded-full"
      />
    </div>
  );
}

const steps = ["mood", "vitals", "journal", "done"];

export default function Checkin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    mood: 3, stress: 5, energy: 5, sleepHours: 6, sleepQuality: 5, focus: 5, journal: "",
  });

  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const next = async () => {
    if (steps[step] === "journal") {
      setSubmitting(true);
      try {
        await submitCheckin(data);
      } finally {
        setSubmitting(false);
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      {steps[step] !== "done" && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-ink-400 mb-1.5">
            <span>Step {step + 1} of {steps.length - 1}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-violet-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-aqua-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {steps[step] === "mood" && (
            <GlassCard strong>
              <h2 className="font-display text-xl font-semibold text-ink-900">How are you feeling right now?</h2>
              <p className="text-sm text-ink-400 mt-1">Pick the option that feels closest.</p>
              <div className="grid grid-cols-5 gap-2 mt-6">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => update({ mood: m.value })}
                    className={cn(
                      "flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all focus-ring",
                      data.mood === m.value ? "border-violet-400 bg-violet-50" : "border-transparent bg-white/60 hover:bg-white"
                    )}
                  >
                    <span className={cn("h-10 w-10 rounded-xl flex items-center justify-center", m.color)}>
                      <m.icon size={20} />
                    </span>
                    <span className="text-[11px] font-medium text-ink-600 text-center leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          )}

          {steps[step] === "vitals" && (
            <GlassCard strong className="space-y-7">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink-900">A few more signals</h2>
                <p className="text-sm text-ink-400 mt-1">This helps MindGuard spot patterns over time.</p>
              </div>
              <SliderField icon={Flame} label="Stress level" hint="0 = none, 10 = overwhelming" value={data.stress} onChange={(v) => update({ stress: v })} />
              <SliderField icon={Zap} label="Energy level" hint="0 = drained, 10 = energized" value={data.energy} onChange={(v) => update({ energy: v })} />
              <SliderField icon={Moon} label="Sleep last night (hours)" min={0} max={12} value={data.sleepHours} onChange={(v) => update({ sleepHours: v })} />
              <SliderField icon={Moon} label="Sleep quality" hint="0 = poor, 10 = excellent" value={data.sleepQuality} onChange={(v) => update({ sleepQuality: v })} />
              <SliderField icon={Focus} label="Focus today" hint="0 = scattered, 10 = sharp" value={data.focus} onChange={(v) => update({ focus: v })} />
            </GlassCard>
          )}

          {steps[step] === "journal" && (
            <GlassCard strong>
              <h2 className="font-display text-xl font-semibold text-ink-900">Anything on your mind? <span className="text-ink-400 font-normal text-sm">(optional)</span></h2>
              <p className="text-sm text-ink-400 mt-1">MindGuard can gently analyze this for patterns and themes.</p>
              <textarea
                value={data.journal}
                onChange={(e) => update({ journal: e.target.value })}
                rows={7}
                placeholder="Write freely — there's no right way to do this…"
                className="w-full mt-4 rounded-2xl border border-violet-100 bg-white/70 p-4 text-sm leading-relaxed focus-ring focus:border-violet-300 resize-none"
              />
              <p className="text-xs text-ink-300 text-right mt-1">{data.journal.length} characters</p>
            </GlassCard>
          )}

          {steps[step] === "done" && (
            <GlassCard strong className="text-center py-14">
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink-900">Check-in complete</h2>
              <p className="text-ink-400 mt-2 max-w-sm mx-auto">Thanks for showing up for yourself today. Your dashboard has been updated.</p>
              <Button className="mt-6" onClick={() => navigate("/dashboard")}>Go to dashboard</Button>
            </GlassCard>
          )}
        </motion.div>
      </AnimatePresence>

      {steps[step] !== "done" && (
        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft size={16} /> Back
          </Button>
          <Button onClick={next} disabled={submitting}>
            {submitting ? "Saving…" : steps[step] === "journal" ? "Finish check-in" : "Continue"} {!submitting && <ArrowRight size={16} />}
          </Button>
        </div>
      )}
    </div>
  );
}
