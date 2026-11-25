import fs from "fs";
import path from "path";
import { HotelSchema } from "../src/schemas/hotel.js";
import { ZodError } from "zod";

const DATA_DIR = path.resolve(process.cwd(), "data", "hotels");

export function validateHotels(dirPath: string = DATA_DIR): boolean {
  console.log("=== Validating Hotel Data Files ===");
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    return false;
  }

  const files = fs.readdirSync(dirPath);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) {
    console.warn("No .json files found in hotel directory.");
    return true;
  }

  let hasErrors = false;
  const seenSlugs = new Map<string, string>();

  for (const file of jsonFiles) {
    const filePath = path.join(dirPath, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const raw = JSON.parse(content);
      const hotel = HotelSchema.parse(raw);

      if (!file.startsWith("_")) {
        const expectedFilename = `${hotel.slug}.json`;
        if (file !== expectedFilename) {
          throw new Error(`Slug '${hotel.slug}' does not match filename '${file}'`);
        }

        if (seenSlugs.has(hotel.slug)) {
          const prior = seenSlugs.get(hotel.slug);
          throw new Error(`Duplicate slug '${hotel.slug}' already declared in ${prior}`);
        }
        seenSlugs.set(hotel.slug, file);
      }

      console.log(`[PASS] ${file} is valid (slug: ${hotel.slug})`);
    } catch (err) {
      hasErrors = true;
      if (err instanceof ZodError) {
        const issues = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
        console.error(`[FAIL] ${file} schema error -> ${issues}`);
      } else if (err instanceof Error) {
        console.error(`[FAIL] ${file} -> ${err.message}`);
      } else {
        console.error(`[FAIL] ${file} -> Unknown error:`, err);
      }
    }
  }

  if (hasErrors) {
    console.error("\nValidation completed with errors.");
    return false;
  }

  console.log("\nAll hotel files passed validation successfully.");
  return true;
}

if (process.argv[1]?.includes("validate-hotels")) {
  const success = validateHotels();
  if (!success) {
    process.exit(1);
  }
}
