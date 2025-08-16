import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import destinationRoutes from "./routes/destination.routes.js";
import incomingRoutes from "./routes/incoming.routes.js";
import logRoutes from "./routes/log.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/server", incomingRoutes);
app.use("/api/logs", logRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

export default app;
