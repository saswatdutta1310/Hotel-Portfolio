import cors from "cors";
import { env } from "../config/env.js";

export const corsMiddleware = cors({
  origin: env.ALLOWED_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
});
