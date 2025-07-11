import { Router } from "express";
import { createPayment, refundPayment } from "./controller.js";

const router = Router();

router.post("/api/pay", createPayment);
router.post("/api/refund", refundPayment);
export default router;
