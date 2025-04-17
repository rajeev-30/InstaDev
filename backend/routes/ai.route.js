import { Router } from "express";
import { aiChatGen, aiCodeGen } from "../controllers/ai.controller.js";

const router = Router();

router.route("/chat").post(aiChatGen);
router.route("/code").post(aiCodeGen);

export default router;