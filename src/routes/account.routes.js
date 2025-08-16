import express from "express";
import { body, param, query, validationResult } from "express-validator";
import { auth, attachRole, requireRole } from "../middleware/auth.js";
import Account from "../models/Account.js";
import AccountMember from "../models/AccountMember.js";
import Role from "../models/Role.js";
import { v4 as uuidv4 } from "uuid";
import { cacheDel, cacheGet, cacheSet } from "../utils/cache.js";

const router = express.Router();

// Create Account
router.post(
  "/",
  auth,
  [body("account_name").notEmpty(), body("website").optional().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: "Invalid Data" });

    const account = await Account.create({
      account_id: uuidv4(),
      account_name: req.body.account_name,
      app_secret_token: uuidv4(),
      website: req.body.website,
      created_by: req.user._id,
      updated_by: req.user._id,
    });

    // make creator admin member
    const adminRole = await Role.findOne({ role_name: "Admin" });
    await AccountMember.create({
      account_id: account._id,
      user_id: req.user._id,
      role_id: adminRole._id,
      created_by: req.user._id,
      updated_by: req.user._id,
    });

    res.json({ success: true, data: account });
  }
);

// Read accounts
router.get("/", auth, [query("q").optional().isString()], async (req, res) => {
  const key = `accounts:${req.user._id}:${req.query.q || ""}`;
  const cached = await cacheGet(key);
  if (cached)
    return res.json({ success: true, data: JSON.parse(cached), cached: true });

  const filter = {};
  if (req.query.q) filter.account_name = { $regex: req.query.q, $options: "i" };
  const accounts = await Account.find(filter).sort({ created_at: -1 }).lean();
  await cacheSet(key, accounts, 30);
  res.json({ success: true, data: accounts });
});

// Update account
router.put(
  "/:accountId",
  auth,
  attachRole,
  requireRole("Admin"),
  [
    param("accountId").isMongoId(),
    body("account_name").optional().notEmpty(),
    body("website").optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: "Invalid Data" });
    const acc = await Account.findByIdAndUpdate(
      req.params.accountId,
      { ...req.body, updated_by: req.user._id },
      { new: true }
    );
    await cacheDel(`accounts:${req.user._id}:`);
    res.json({ success: true, data: acc });
  }
);

// Delete account
router.delete(
  "/:accountId",
  auth,
  attachRole,
  requireRole("Admin"),
  async (req, res) => {
    const { accountId } = req.params;
    await AccountMember.deleteMany({ account_id: accountId });
    await (
      await import("../models/Destination.js")
    ).default.deleteMany({ account_id: accountId });
    await (
      await import("../models/Log.js")
    ).default.deleteMany({ account_id: accountId });
    await Account.findByIdAndDelete(accountId);
    res.json({ success: true, message: "Account deleted" });
  }
);

// Add/Remove Members (Admin)
router.post(
  "/:accountId/members",
  auth,
  attachRole,
  requireRole("Admin"),
  [
    body("user_id").isMongoId(),
    body("role_name").isString().isIn(["Admin", "Normal user"]),
  ],
  async (req, res) => {
    const { accountId } = req.params;
    const role = await Role.findOne({ role_name: req.body.role_name });
    const member = await AccountMember.findOneAndUpdate(
      { account_id: accountId, user_id: req.body.user_id },
      { role_id: role._id, updated_by: req.user._id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: member });
  }
);

router.delete(
  "/:accountId/members/:userId",
  auth,
  attachRole,
  requireRole("Admin"),
  async (req, res) => {
    const { accountId, userId } = req.params;
    await AccountMember.findOneAndDelete({
      account_id: accountId,
      user_id: userId,
    });
    res.json({ success: true, message: "Member removed" });
  }
);

export default router;
