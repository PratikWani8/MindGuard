import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Tag, Brain } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmotionDonut from "../../components/charts/EmotionDonut";
import { fetchJournalById, analyzeJournal } from "../../services/journalApi";

const emotionColors = ["#e8823d", "#e85d5d", "#7c9ce6", "#e8a53d", "#3fb886", "#9679f0"];

export default function JournalEntry() {
  const { id } = useParams();
  const location = useLocation();
  const [entry, setEntry] = useState(location.state?.draft || null);
  const [loading, setLoading] = useState(!location.state?.draft);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    let active = true;
    fetchJournalById(id).then((data) => {
      if (!active) return;
      if (data) setEntry(data);
      setLoading(false);
      if (location.state?.runAnalysis && data && !data.analyzed) {
        runAnalysis();
      }
    });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeJournal(id);
      setEntry(result);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading entry" size="lg" />;
  if (!entry) return <GlassCard>Entry not found.</GlassCard>;

  const emotionData = (entry.emotions || []).map((e, i) => ({ ...e, color: emotionColors[i % emotionColors.length] }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/dashboard/journal/history" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-violet-600">
        <ArrowLeft size={16} /> Back to journal history
      </Link>

      <GlassCard strong>
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-300">{entry.date}</span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 mt-1">{entry.title}</h1>
        <p className="text-ink-600 leading-relaxed mt-4 whitespace-pre-line">{entry.content}</p>
      </GlassCard>

      {!entry.analyzed && !analyzing && (
        <GlassCard className="text-center py-8">
          <Sparkles className="mx-auto text-violet-400 mb-2" size={26} />
          <p className="text-ink-500 text-sm mb-4">This entry hasn't been analyzed yet.</p>
          <Button onClick={runAnalysis}>Analyze with AI</Button>
        </GlassCard>
      )}

      {analyzing && <LoadingSpinner label="Analyzing your entry" size="lg" />}

      {entry.analyzed && !analyzing && (
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-violet-600" />
              <p className="font-display font-semibold text-ink-900">Emotion breakdown</p>
            </div>
            <EmotionDonut data={emotionData} />
          </GlassCard>

          <div className="space-y-4">
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={17} className="text-violet-600" />
                <p className="font-display font-semibold text-ink-900">Detected themes</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.themes?.map((t) => (
                  <span key={t} className="text-xs bg-violet-50 text-violet-700 px-3 py-1.5 rounded-full font-medium">{t}</span>
                ))}
              </div>
            </GlassCard>

            <GlassCard strong>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={17} className="text-violet-600" />
                <p className="font-display font-semibold text-ink-900">AI insight</p>
              </div>
              <p className="text-sm text-ink-500 leading-relaxed">{entry.insight}</p>
              <p className="text-[11px] text-ink-300 mt-3">This is a wellbeing-support observation, not a diagnosis.</p>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
