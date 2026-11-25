import { Router, Request, Response } from "express";
import { getAllHotels, getHotel, toSummary } from "../services/hotel-loader.js";

export const hotelsRouter = Router();

// GET /api/hotels -> { "hotels": HotelSummary[] }
hotelsRouter.get("/", (_req: Request, res: Response) => {
  const hotels = getAllHotels();
  const summaries = hotels.map(toSummary);
  res.json({ hotels: summaries });
});

// GET /api/hotels/:slug -> Hotel or 404 NOT_FOUND
hotelsRouter.get("/:slug", (req: Request, res: Response) => {
  const { slug } = req.params;
  const hotel = getHotel(slug);

  if (!hotel) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: `Hotel not found: ${slug}`
      }
    });
  }

  return res.json(hotel);
});
