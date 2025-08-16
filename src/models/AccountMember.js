import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    event_id: { type: String, required: true, unique: true, index: true },
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    destination_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
    received_timestamp: { type: Date, required: true },
    processed_timestamp: { type: Date },
    received_data: { type: Object, required: true },
    status: {
      type: String,
      enum: ["success", "failed", "received", "queued"],
      required: true,
    },
  },
  { timestamps: false }
);

export default mongoose.model("Log", LogSchema);
