import express from "express";
import helmet from "helmet";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";
import { healthRouter } from "./routes/health.js";
import { hotelsRouter } from "./routes/hotels.js";
import { enquiryRouter } from "./routes/enquiry.js";

export const app = express();

app.use(helmet());
app.use(corsMiddleware);

// Standard JSON parser for other routes
app.use(express.json());

// Routes
app.use(healthRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/enquiry", enquiryRouter);

// Unknown route handling (404)
app.use(notFoundHandler);

// Central error handler
app.use(errorHandler);
