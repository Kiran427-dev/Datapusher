import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    role_name: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Role", RoleSchema);
