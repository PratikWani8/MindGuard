import CheckIn from "../models/CheckIn.js";
import AIAnalysis from "../models/AIAnalysis.js";
import RiskEvent from "../models/RiskEvent.js";
import { analyzeCheckIn } from "../services/aiService.js";
import { success, failure } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const owned = (id, userId) => ({ _id: id, userId });

export const createCheckIn = asyncHandler(async (req, res) => {
  const checkIn = await CheckIn.create({ ...req.body, userId: req.user._id });

  try {
    const ai = await analyzeCheckIn({
      userId: req.user._id.toString(),
      checkIn: {
        id: checkIn._id.toString(),
        mood: checkIn.mood,
        stressLevel: checkIn.stressLevel,
        energyLevel: checkIn.energyLevel,
        sleepHours: checkIn.sleepHours,
        sleepQuality: checkIn.sleepQuality,
        focusLevel: checkIn.focusLevel,
        journalText: checkIn.journalText || ""
      }
    });

    const result = ai.data || ai;
    const analysis = await AIAnalysis.create({
      ...result,
      userId: req.user._id,
      checkInId: checkIn._id
    });

    if (analysis.supportLevel === "elevated" || analysis.supportLevel === "urgent_support") {
      await RiskEvent.create({
        userId: req.user._id,
        source: "checkin",
        supportLevel: analysis.supportLevel,
        reason: (analysis.insights || []).join("; ") || "AI identified a need for additional support"
      });
    }
  } catch (error) {
    console.error("AI check-in analysis failed:", error.message);
  }

  return success(res, { checkIn }, "Check-in created", 201);
});

export const listCheckIns = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const checkIns = await CheckIn.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(limit);
  success(res, { checkIns }, "Check-ins retrieved");
});

export const getCheckIn = asyncHandler(async (req, res) => {
  const checkIn = await CheckIn.findOne(owned(req.params.id, req.user._id));
  if (!checkIn) return failure(res, "Check-in not found", [], 404);
  success(res, { checkIn }, "Check-in retrieved");
});

export const today = asyncHandler(async (req, res) => {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setHours(23, 59, 59, 999);
  const checkIn = await CheckIn.findOne({
    userId: req.user._id, createdAt: { $gte: start, $lte: end }
  }).sort({ createdAt: -1 });
  success(res, { checkIn }, "Today's check-in retrieved");
});

export const trends = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const checkIns = await CheckIn.find({ userId: req.user._id })
    .sort({ createdAt: 1 }).limit(limit)
    .select("mood stressLevel energyLevel sleepHours sleepQuality focusLevel createdAt");
  success(res, { checkIns }, "Check-in trends retrieved");
});