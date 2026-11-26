import cors from "cors";
import { env } from "../config/env.js";

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin requests where origin header is not sent
    if (!origin) {
      return callback(null, true);
    }

    if (env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin '${origin}' not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
});
