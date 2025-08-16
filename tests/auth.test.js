import request from "supertest";
import app from "../src/app.js";

describe("Auth", () => {
  it("rejects invalid register", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
