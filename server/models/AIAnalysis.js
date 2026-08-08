import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  checkInId: { type: mongoose.Schema.Types.ObjectId, ref: "CheckIn", index: true },
  journalId: { type: mongoose.Schema.Types.ObjectId, ref: "Journal", index: true },
  sentiment: { type: String, enum: ["positive", "neutral", "negative", "mixed"] },
  emotions: { type: Map, of: Number, default: {} },
  stressIndicators: { type: [String], default: [] },
  detectedTopics: { type: [String], default: [] },
  trendScore: { type: Number, min: -1, max: 1 },
  supportLevel: {
    type: String,
    enum: ["stable", "needs_attention", "elevated", "urgent_support"]
  },
  insights: { type: [String], default: [] },
  recommendations: { type: [String], default: [] },
  safetyMetadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  modelVersion: { type: String, default: "unknown" }
}, { timestamps: true });

aiAnalysisSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("AIAnalysis", aiAnalysisSchema);