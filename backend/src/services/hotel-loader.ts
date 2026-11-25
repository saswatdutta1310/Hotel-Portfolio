import fs from "fs";
import path from "path";
import { Hotel, HotelSchema, HotelSummary } from "../schemas/hotel.js";
import { ZodError } from "zod";

const DATA_DIR = path.resolve(process.cwd(), "data", "hotels");

export class HotelValidationError extends Error {
  public readonly file: string;
  public readonly field: string;

  constructor(file: string, field: string, message: string) {
    super(`Error in ${file} at field '${field}': ${message}`);
    this.name = "HotelValidationError";
    this.file = file;
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function toSummary(hotel: Hotel): HotelSummary {
  const heroImage =
    hotel.gallery.length > 0
      ? hotel.gallery[0].src
      : hotel.rooms.length > 0 && hotel.rooms[0].images.length > 0
        ? hotel.rooms[0].images[0]
        : `/hotels/${hotel.slug}/hero.jpg`;

  return {
    slug: hotel.slug,
    name: hotel.name,
    tagline: hotel.tagline,
    city: hotel.address.city,
    startingPrice: hotel.startingPrice,
    heroImage
  };
}

export function loadAllHotelsFromDir(dirPath: string = DATA_DIR): Hotel[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath);
  const jsonFiles = files.filter(
    (f) => f.endsWith(".json") && !f.startsWith("_")
  );

  const hotels: Hotel[] = [];
  const seenSlugs = new Map<string, string>(); // slug -> fileName

  for (const file of jsonFiles) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, "utf-8");
    let rawData: unknown;
    try {
      rawData = JSON.parse(content);
    } catch {
      throw new HotelValidationError(file, "file", "Invalid JSON syntax");
    }

    let parsedHotel: Hotel;
    try {
      parsedHotel = HotelSchema.parse(rawData);
    } catch (err) {
      if (err instanceof ZodError && err.errors.length > 0) {
        const firstIssue = err.errors[0];
        const fieldName = firstIssue.path.length > 0 ? firstIssue.path.join(".") : "root";
        throw new HotelValidationError(file, fieldName, firstIssue.message);
      }
      throw new HotelValidationError(file, "unknown", "Schema validation failed");
    }

    const expectedFilename = `${parsedHotel.slug}.json`;
    if (file !== expectedFilename) {
      throw new HotelValidationError(
        file,
        "slug",
        `Slug '${parsedHotel.slug}' does not match filename '${file}'`
      );
    }

    if (seenSlugs.has(parsedHotel.slug)) {
      const priorFile = seenSlugs.get(parsedHotel.slug)!;
      throw new HotelValidationError(
        file,
        "slug",
        `Duplicate slug '${parsedHotel.slug}' already defined in '${priorFile}'`
      );
    }

    seenSlugs.set(parsedHotel.slug, file);
    hotels.push(parsedHotel);
  }

  return hotels;
}

export function getAllHotels(): Hotel[] {
  return loadAllHotelsFromDir();
}

export function getHotel(slug: string): Hotel | undefined {
  const hotels = getAllHotels();
  return hotels.find((h) => h.slug === slug);
}
