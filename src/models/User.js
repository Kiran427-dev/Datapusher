import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("User", UserSchema);
