import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const incomingDataLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX_PER_WINDOW,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers["cl-x-token"] || req.ip,
  message: { success: false, message: "Rate limit exceeded" },
});
