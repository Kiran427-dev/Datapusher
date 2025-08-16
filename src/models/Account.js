import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    account_id: { type: String, required: true, unique: true, index: true },
    account_name: { type: String, required: true },
    app_secret_token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    website: { type: String },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Account", AccountSchema);
