// routes/ewaste.routes.js
import { Router } from "express";
import { createEwasteItem, getByQrCode, updateStatus } from "../controllers/eWasteController.js";
import { authMiddleware } from "../middleware/requireAuth.js";

const router = Router();

// Protected routes
router.post("/", authMiddleware, createEwasteItem);
router.get("/qr/:qr", authMiddleware, getByQrCode);
router.put("/:id/status", authMiddleware, updateStatus);

export default router;
