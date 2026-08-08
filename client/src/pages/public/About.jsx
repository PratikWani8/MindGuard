import { HeartPulse, Target, Users2, ShieldCheck } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";

const values = [
  { icon: HeartPulse, title: "Support, not diagnosis", body: "Every signal MindGuard shows is framed as wellbeing support — real clinical judgment stays with real professionals." },
  { icon: Target, title: "Early, not reactive", body: "We look for gentle shifts across days and weeks, so small changes get noticed before they compound." },
  { icon: ShieldCheck, title: "Safety by default", body: "Flagged situations are routed to human review, and emergency guidance is always one tap away." },
  { icon: Users2, title: "Built with real routines", body: "Designed around the way students and young professionals actually check in — quick, honest, low-friction." },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
      <SectionHeading
        eyebrow="About MindGuard"
        title="A calmer way to notice how you're really doing"
        description="MindGuard was built for a simple reason: most people don't get a clear signal about their own wellbeing until it's already a crisis. We wanted an early, gentle, evidence-informed nudge instead."
      />

      <div className="mt-14 grid sm:grid-cols-2 gap-5">
        {values.map((v) => (
          <GlassCard key={v.title}>
            <div className="h-11 w-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
              <v.icon size={20} strokeWidth={1.8} />
            </div>
            <h3 className="font-display font-semibold text-ink-900">{v.title}</h3>
            <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{v.body}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard strong className="mt-14">
        <h3 className="font-display text-xl font-semibold text-ink-900">Built for a hackathon, designed for real use</h3>
        <p className="text-ink-500 mt-2 leading-relaxed">
          MindGuard combines a mood and journal check-in flow, an AI analysis layer, and a support-escalation
          path — all wrapped in a calm, distraction-free interface. It's a demonstration of what responsible,
          human-centered AI in mental wellness could look like: helpful, transparent about its limits, and
          quick to bring in real people when it matters.
        </p>
      </GlassCard>
    </div>
  );
}
