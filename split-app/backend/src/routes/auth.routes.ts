// routes/auth.routes.ts
import { Router } from "express";
import { signup, login, getProfile } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateToken, getProfile);

export default router;
