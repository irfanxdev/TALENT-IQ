import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createSession, endSession, getActiveSessions, getMyRecentSessions, getSessionById, joinSession } from "../controllers/sessionControllers.js";

const router=express.Router();

router.get("/active",protectRoute,getActiveSessions);
router.post("/",protectRoute,createSession);
router.get("/my-recent",protectRoute,getMyRecentSessions);

router.get("/:id",protectRoute,getSessionById);
router.post("/:id/join",protectRoute,joinSession);
router.post("/:id/end",protectRoute,endSession);

export default router;