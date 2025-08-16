import express from "express";
import { body, header, validationResult } from "express-validator";
import Account from "../models/Account.js";
import { incomingDataLimiter } from "../middleware/rateLimit.js";
import Log from "../models/Log.js";

const router = express.Router();

router.post(
  "/incoming_data",
  incomingDataLimiter,
  [
    header("CL-X-TOKEN").exists().withMessage("Missing CL-X-TOKEN"),
    header("CL-X-EVENT-ID").exists().withMessage("Missing CL-X-EVENT-ID"),
    body().isObject().withMessage("Body must be JSON object"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Data",
        errors: errors.array(),
      });
    }

    const token = req.headers["cl-x-token"];
    const event_id = req.headers["cl-x-event-id"];

    const account = await Account.findOne({ app_secret_token: token });
    if (!account) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Log received data
    await Log.create({
      eventId: event_id,
      accountId: account._id,
      receivedTimestamp: new Date(),
      receivedData: req.body,
      status: "queued",
    });

    // Directly call the dispatch logic instead of adding to a queue
    try {
      const { handler } = await import("../queue/dispatch.worker.js");
      await handler({
        eventId: event_id,
        accountId: account._id,
        payload: req.body,
      });
    } catch (err) {
      console.error("Dispatch failed", err);
      return res.status(500).json({ success: false, message: "Processing failed" });
    }

    return res.json({ success: true, message: "Data Received & Processed" });
  }
);

export default router;
