import { Router } from "express";
import { createJournal, listJournals, getJournal, updateJournal, deleteJournal } from "../controllers/journalController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();
router.use(protect);
router.post("/", validateBody({ content: { required: true, type: "string", minLength: 1, maxLength: 20000 } }), createJournal);
router.get("/", listJournals);
router.get("/:id", getJournal);
router.put("/:id", validateBody({ content: { required: true, type: "string", minLength: 1, maxLength: 20000 } }), updateJournal);
router.delete("/:id", deleteJournal);
export default router;