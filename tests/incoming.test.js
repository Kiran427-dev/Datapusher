import request from "supertest";
import app from "../src/app.js";

describe("Incoming data", () => {
  it("rejects missing headers", async () => {
    const res = await request(app)
      .post("/api/server/incoming_data")
      .send({ hello: "world" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
