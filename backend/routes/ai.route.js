import { Router } from "express";
import { aiChatGen, aiCodeGen, aiPromptEnhance, getModels } from "../controllers/ai.controller.js";
import { isAuthenticated } from "../db/auth.js";

const router = Router();

router.route("/chat").post(isAuthenticated, aiChatGen);
router.route("/code").post(isAuthenticated, aiCodeGen);
router.route("/enhance").post(isAuthenticated, aiPromptEnhance);
router.route("/models").get(getModels);

export default router;