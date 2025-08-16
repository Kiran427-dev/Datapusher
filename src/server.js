import mongoose from "mongoose";
import { env } from "./config/env.js";
import app from "./app.js";
import { initWorker } from "./queue/index.js";

async function bootstrap() {
  await mongoose.connect(env.MONGO_URI);
  initWorker();
  app.listen(env.PORT, () => console.log(`Server listening on ${env.PORT}`));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
