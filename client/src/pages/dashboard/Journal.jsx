import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, History } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { createJournal, fetchJournals } from "../../services/journalApi";

export default function Journal() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJournals = async () => {
      try {
        const journals = await fetchJournals();
        setRecent(journals.slice(0, 3));
      } catch (error) {
        console.error("Failed to load journals:", error);
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };

    loadJournals();
  }, []);

  const onSave = async () => {
    if (!content.trim()) return;

    setSaving(true);

    try {
      const entry = await createJournal({
        title: title.trim() || "Untitled entry",
        content: content.trim(),
      });

      navigate(`/dashboard/journal/${entry.id}`, {
        state: {
          draft: entry,
        },
      });
    } catch (error) {
      console.error("Failed to create journal:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <GlassCard strong>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-ink-900">
              New journal entry
            </h2>

            <Link
              to="/dashboard/journal/history"
              className="text-xs font-medium text-violet-600 hover:underline flex items-center gap-1"
            >
              <History size={13} />
              View history
            </Link>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this entry a title (optional)"
            className="w-full rounded-xl border border-violet-100 bg-white/70 px-4 py-2.5 text-sm font-medium focus-ring focus:border-violet-300 mb-3"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="What's on your mind today? Write freely — MindGuard can gently analyze this for patterns."
            className="w-full rounded-2xl border border-violet-100 bg-white/70 p-4 text-sm leading-relaxed focus-ring focus:border-violet-300 resize-none"
          />

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-ink-300">
              {content.length} characters
            </p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onSave}
                disabled={saving || !content.trim()}
              >
                Save only
              </Button>

              <Button
                size="sm"
                onClick={onSave}
                disabled={saving || !content.trim()}
              >
                <Sparkles size={15} />
                {saving ? "Saving…" : "Save & analyze"}
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <p className="font-display font-semibold text-ink-900 px-1">
          Recent entries
        </p>

        {loading ? (
          <LoadingSpinner label="Loading entries" />
        ) : recent.length === 0 ? (
          <GlassCard>
            <p className="text-sm text-ink-400">
              No journal entries yet.
            </p>
          </GlassCard>
        ) : (
          recent.map((j) => (
            <Link key={j.id} to={`/dashboard/journal/${j.id}`}>
              <GlassCard className="hover:bg-white/80 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-ink-800">
                    {j.title}
                  </p>

                  <span className="text-[11px] text-ink-300">
                    {j.date}
                  </span>
                </div>

                <p className="text-xs text-ink-400 line-clamp-2">
                  {j.excerpt}
                </p>

                <div className="flex items-center gap-1 text-xs text-violet-600 font-medium mt-2">
                  View entry
                  <ArrowRight size={12} />
                </div>
              </GlassCard>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}