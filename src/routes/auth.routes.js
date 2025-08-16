import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Account from "../models/Account.js";
import AccountMember from "../models/AccountMember.js";
import { generateToken } from "../utils/generateToken.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("account_name").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        success: false,
        message: "Invalid Data",
        errors: errors.array(),
      });

    const { email, password, account_name, website } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    // Seed roles if not present
    let adminRole = await Role.findOne({ role_name: "Admin" });
    if (!adminRole) adminRole = await Role.create({ role_name: "Admin" });
    let userRole = await Role.findOne({ role_name: "Normal user" });
    if (!userRole) userRole = await Role.create({ role_name: "Normal user" });

    // Create default account for the user as Admin
    const account = await Account.create({
      account_id: uuidv4(),
      account_name,
      app_secret_token: uuidv4(),
      website,
      created_by: user._id,
      updated_by: user._id,
    });

    await AccountMember.create({
      account_id: account._id,
      user_id: user._id,
      role_id: adminRole._id,
      created_by: user._id,
      updated_by: user._id,
    });

    const token = generateToken(user);
    res.json({ success: true, message: "Registered", token, account });
  }
);

// Login
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        success: false,
        message: "Invalid Data",
        errors: errors.array(),
      });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    const token = generateToken(user);
    res.json({ success: true, message: "Logged in", token });
  }
);

// Logout
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out" });
});

export default router;
