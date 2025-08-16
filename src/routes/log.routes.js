import express from "express";
import { query } from "express-validator";
import Log from "../models/Log.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  auth,
  [
    query("account_id").isMongoId(),
    query("status")
      .optional()
      .isIn(["success", "failed", "received", "queued"]),
    query("event_id").optional().isString(),
  ],
  async (req, res) => {
    const filter = { account_id: req.query.account_id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.event_id) filter.event_id = req.query.event_id;
    const logs = await Log.find(filter).sort({ received_timestamp: -1 }).lean();
    res.json({ success: true, data: logs });
  }
);

export default router;
