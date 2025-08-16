import axios from "axios";
import Destination from "../models/Destination.js";
import Log from "../models/Log.js";

export async function handler({ event_id, account_id, payload }) {
  const destinations = await Destination.find({ account_id }).lean();
  const now = new Date();
  for (const dest of destinations) {
    const headers = dest.headers.reduce((acc, h) => {
      acc[h.key] = h.value;
      return acc;
    }, {});
    try {
      const method = dest.method.toLowerCase();
      const config = { url: dest.url, method, headers };
      if (["post", "put", "patch"].includes(method)) config.data = payload;
      await axios(config);
      await Log.create({
        event_id: `${event_id}:${dest._id}`,
        account_id,
        destination_id: dest._id,
        received_timestamp: now,
        processed_timestamp: new Date(),
        received_data: payload,
        status: "success",
      });
    } catch (err) {
      await Log.create({
        event_id: `${event_id}:${dest._id}`,
        account_id,
        destination_id: dest._id,
        received_timestamp: now,
        processed_timestamp: new Date(),
        received_data: payload,
        status: "failed",
      });
    }
  }
}
