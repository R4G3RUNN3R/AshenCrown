import { Router } from "express";
import { getProfile } from "../controllers/profileController.js";
import { requireSession } from "../middleware/requireSession.js";

const router = Router();

router.get("/profiles/:publicId", getProfile);
router.get("/me/profile", requireSession, (req, res) => res.redirect(307, `/api/profiles/${req.auth.user.publicId}`));

export default router;
