import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  content: { type: String, required: true, trim: true, minlength: 1, maxlength: 20000 }
}, { timestamps: true });

journalSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("Journal", journalSchema);