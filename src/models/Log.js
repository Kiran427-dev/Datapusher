import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    receivedTimestamp: { type: Date, required: true },
    processedTimestamp: { type: Date },
    receivedData: { type: mongoose.Schema.Types.Mixed, required: true },
    status: { type: String, required: true },
  },
  { timestamps: false }
);

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
