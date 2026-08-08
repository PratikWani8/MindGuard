import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tag, TrendingDown, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import RiskBadge from "../../components/cards/RiskBadge";
import EmotionDonut from "../../components/charts/EmotionDonut";
import TriggerBarChart from "../../components/charts/TriggerBarChart";
import { fetchWellbeingStatus, fetchDailyInsight, fetchThemesAndEmotions } from "../../services/insightApi";

export default function Insights() {
  const [status, setStatus] = useState(null);
  const [insight, setInsight] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchWellbeingStatus(), fetchDailyInsight(), fetchThemesAndEmotions()]).then(([s, i, p]) => {
      setStatus(s); setInsight(i); setPatterns(p); setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner label="Analyzing your recent patterns" size="lg" />;

  return (
    <div className="space-y-6">
      <GlassCard strong className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-500 mb-1">Current status</p>
          <h2 className="font-display text-2xl font-semibold text-ink-900">{status.summary}</h2>
        </div>
        <RiskBadge level={status.level} size="lg" />
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <p className="font-display font-semibold text-ink-900 mb-3">Emotional patterns this week</p>
          <EmotionDonut data={patterns.emotions} />
        </GlassCard>

        <GlassCard>
          <p className="font-display font-semibold text-ink-900 mb-3">Common triggers</p>
          <TriggerBarChart data={patterns.triggers} />
        </GlassCard>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Tag size={18} className="text-violet-600" />
            <p className="font-display font-semibold text-ink-900">Recurring themes</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {patterns.themes.map((t) => (
              <span key={t} className="text-xs bg-violet-50 text-violet-700 px-3 py-1.5 rounded-full font-medium">{t}</span>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={18} className="text-calm-orange" />
              <p className="font-display font-semibold text-ink-900">Recent change</p>
            </div>
            <p className="text-sm text-ink-500">Stress has trended upward over the last 4 check-ins, while sleep and focus have declined in parallel.</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard strong className="relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-200 to-aqua-200 opacity-50 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center shrink-0">
              <Sparkles size={19} />
            </div>
            <div>
              <p className="font-display font-semibold text-ink-900">{insight.title}</p>
              <p className="text-sm text-ink-500 mt-1 max-w-xl leading-relaxed">{insight.body}</p>
            </div>
          </div>
          <Button as={Link} to="/dashboard/wellness-plan" className="shrink-0">
            View your plan <ArrowRight size={16} />
          </Button>
        </div>
      </GlassCard>

      <p className="text-xs text-ink-300 text-center">
        These insights describe wellbeing-support signals based on your check-ins, not a medical diagnosis.
      </p>
    </div>
  );
}
