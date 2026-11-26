import { Router, Request, Response } from "express";
import { getAllHotels } from "../services/hotel-loader.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req: Request, res: Response) => {
  const hotels = getAllHotels();
  res.json({
    status: "ok",
    hotelsLoaded: hotels.length,
    uptime: process.uptime()
  });
});
