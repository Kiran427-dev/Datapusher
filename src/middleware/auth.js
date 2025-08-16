import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import AccountMember from "../models/AccountMember.js";
import Role from "../models/Role.js";

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}
export async function attachRole(req, res, next) {
  try {
    const accountId =
      req.params.accountId || req.body.account_id || req.query.account_id;
    if (!accountId || !req.user) return next();
    const membership = await AccountMember.findOne({
      account_id: accountId,
      user_id: req.user._id,
    }).populate("role_id");
    if (membership)
      req.membership = { role: membership.role_id.role_name, membership };
    next();
  } catch (e) {
    next();
  }
}

export function requireRole(required) {
  return (req, res, next) => {
    const role = req.membership?.role;
    if (!role)
      return res.status(403).json({ success: false, message: "Forbidden" });
    if (required === "Admin" && role !== "Admin")
      return res.status(403).json({ success: false, message: "Forbidden" });
    next();
  };
}
