import express from "express";
import { body, param, query, validationResult } from "express-validator";
import { auth, attachRole, requireRole } from "../middleware/auth.js";
import Destination from "../models/Destination.js";

const router = express.Router();

// Create destination
router.post(
  "/",
  auth,
  [
    body("account_id").isMongoId(),
    body("url").isURL({ require_tld: false }),
    body("method").isIn(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body("headers").isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: "Invalid Data" });
    const dest = await Destination.create({
      ...req.body,
      created_by: req.user._id,
      updated_by: req.user._id,
    });
    res.json({ success: true, data: dest });
  }
);

// List destinations with filters
router.get(
  "/",
  auth,
  [query("account_id").optional().isMongoId()],
  async (req, res) => {
    const filter = {};
    if (req.query.account_id) filter.account_id = req.query.account_id;
    const list = await Destination.find(filter).sort({ created_at: -1 }).lean();
    res.json({ success: true, data: list });
  }
);

// Update destination
router.put("/:id", auth, [param("id").isMongoId()], async (req, res) => {
  const dest = await Destination.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_by: req.user._id },
    { new: true }
  );
  res.json({ success: true, data: dest });
});

// Delete destination
router.delete("/:id", auth, [param("id").isMongoId()], async (req, res) => {
  await Destination.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Destination deleted" });
});

export default router;
