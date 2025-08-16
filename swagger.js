import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./src/config/env.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Data Pusher API", version: "1.0.0" },
    servers: [{ url: env.BASE_URL }],
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
