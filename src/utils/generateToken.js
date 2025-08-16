import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}
