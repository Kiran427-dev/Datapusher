import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 4000,
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://datapusher:kiran@cluster0.7ntkhx3.mongodb.net/datapush?retryWrites=true&w=majority&appName=Cluster0",
  JWT_SECRET: process.env.JWT_SECRET || "sjdfh723r8r9hf983hf9834f98hf",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  RATE_LIMIT_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || "1000",
    10
  ),
  RATE_LIMIT_MAX_PER_WINDOW: parseInt(
    process.env.RATE_LIMIT_MAX_PER_WINDOW || "5",
    10
  ),
  BASE_URL: process.env.BASE_URL || "http://localhost:4000",
};
