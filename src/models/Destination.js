import mongoose from "mongoose";

const HeaderSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const DestinationSchema = new mongoose.Schema(
  {
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    url: { type: String, required: true },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      required: true,
    },
    headers: { type: [HeaderSchema], required: true },
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

export default mongoose.model("Destination", DestinationSchema);
