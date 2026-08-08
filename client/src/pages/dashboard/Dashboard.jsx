import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Smile, Flame, Moon, Target, ArrowRight, CalendarCheck, Wind, BookOpen } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatCard from "../../components/cards/StatCard";
import InsightCard from "../../components/cards/InsightCard";
import RiskBadge from "../../components/cards/RiskBadge";
import MultiTrendChart from "../../components/charts/MultiTrendChart";
import { useAuth } from "../../context/AuthContext";
import { fetchMoodTrend, fetchTodayCheckin } from "../../services/checkinApi";
import { fetchWellbeingStatus, fetchDailyInsight } from "../../services/insightApi";
import { fetchRecommendations } from "../../services/wellnessApi";

export default function Dashboard() {
  const { user } = useAuth();
  const [trend, setTrend] = useState(null);
  const [status, setStatus] = useState(null);
  const [insight, setInsight] = useState(null);
  const [checkedInToday, setCheckedInToday] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchMoodTrend("7d"),
      fetchWellbeingStatus(),
      fetchDailyInsight(),
      fetchTodayCheckin(),
      fetchRecommendations(),
    ]).then(([t, s, i, c, r]) => {
      setTrend(t);
      setStatus(s);
      setInsight(i);
      setCheckedInToday(c);
      setRecs(r.slice(0, 3));
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard" size="lg" />;

  const latest = trend[trend.length - 1];

  return (
    <div className="space-y-6">
      <GlassCard strong className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-400">Welcome back,</p>
          <h2 className="font-display text-2xl font-semibold text-ink-900">{user?.name?.split(" ")[0] || "there"} 👋</h2>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={status.level} size="lg" />
        </div>
      </GlassCard>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Wellbeing score" value={status.score} unit="/100" accent="violet" />
        <StatCard icon={Smile} label="Mood today" value={latest.mood.toFixed(1)} unit="/5" accent="green" />
        <StatCard icon={Flame} label="Stress today" value={latest.stress.toFixed(1)} unit="/10" accent="amber" />
        <StatCard icon={Moon} label="Sleep last night" value={latest.sleep.toFixed(1)} unit="hrs" accent="aqua" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-1">
              <p className="font-display font-semibold text-ink-900">7-day trend</p>
              <Link to="/dashboard/trends" className="text-xs font-medium text-violet-600 hover:underline flex items-center gap-1">
                Full trends <ArrowRight size={13} />
              </Link>
            </div>
            <MultiTrendChart data={trend} />
          </GlassCard>

          <InsightCard title={insight.title} body={insight.body} />
        </div>

        <div className="space-y-6">
          <GlassCard strong>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <CalendarCheck size={19} />
              </div>
              <p className="font-display font-semibold text-ink-900">
                {checkedInToday ? "You checked in today" : "Have you checked in today?"}
              </p>
            </div>
            <p className="text-sm text-ink-500 mb-4">
              {checkedInToday
                ? "Great consistency — come back tomorrow to keep your trend accurate."
                : "A quick 30-second check-in keeps your insights sharp and your plan personalized."}
            </p>
            <Button as={Link} to="/dashboard/checkin" className="w-full" disabled={!!checkedInToday}>
              {checkedInToday ? "Checked in ✓" : "Start check-in"}
            </Button>
          </GlassCard>

          <GlassCard>
            <p className="font-display font-semibold text-ink-900 mb-3">Recommended for you</p>
            <div className="space-y-3">
              {recs.map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-aqua-400/20 text-aqua-500 flex items-center justify-center shrink-0">
                    <Wind size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-800 truncate">{r.title}</p>
                    <p className="text-xs text-ink-400">{r.duration}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button as={Link} to="/dashboard/wellness-plan" variant="secondary" size="sm" className="w-full mt-4">
              View wellness plan
            </Button>
          </GlassCard>

          <GlassCard className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
              <BookOpen size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-800">Write in your journal</p>
              <p className="text-xs text-ink-400">Unpack today in a few sentences.</p>
            </div>
            <Link to="/dashboard/journal" className="text-violet-600">
              <ArrowRight size={17} />
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
