import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";
import { healthRouter } from "./routes/health.js";
import { hotelsRouter } from "./routes/hotels.js";
import { enquiryRouter } from "./routes/enquiry.js";

export const app = express();

// Apply trust proxy hops so Express and rate limiters see real client IP behind reverse proxy
app.set("trust proxy", env.TRUST_PROXY);

app.use(helmet());
app.use(corsMiddleware);

// Routes with their own body parser
app.use("/api/enquiry", enquiryRouter);

// Standard JSON parser for other routes
app.use(express.json());

// Other routes
app.use(healthRouter);
app.use("/api/hotels", hotelsRouter);

// Unknown route handling (404)
app.use(notFoundHandler);

// Central error handler
app.use(errorHandler);
