import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data", "hotels");
const TEMPLATE_PATH = path.join(DATA_DIR, "_template.json");

export function createNewHotel(slugArg?: string): void {
  const slug = slugArg || process.argv[2];

  if (!slug) {
    console.error("Usage: tsx scripts/new-hotel.ts <slug>");
    console.error("Example: tsx scripts/new-hotel.ts emerald-haven-resort");
    process.exit(1);
  }

  const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!KEBAB_CASE_REGEX.test(slug)) {
    console.error(`Error: Slug '${slug}' must be in kebab-case format (lowercase letters, numbers, hyphens).`);
    process.exit(1);
  }

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Error: Template file not found at ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  const targetPath = path.join(DATA_DIR, `${slug}.json`);
  if (fs.existsSync(targetPath)) {
    console.error(`Error: Hotel file already exists at ${targetPath}. Refusing to overwrite.`);
    process.exit(1);
  }

  try {
    const templateContent = JSON.parse(fs.readFileSync(TEMPLATE_PATH, "utf-8"));
    const newHotel = {
      ...templateContent,
      slug,
      name: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      gallery: [
        {
          src: `/hotels/${slug}/hero.jpg`,
          alt: `${slug} main view`,
          category: "Exterior"
        }
      ],
      rooms: templateContent.rooms.map((r: { id: string; name: string; images: string[] }, idx: number) => ({
        ...r,
        images: [`/hotels/${slug}/room-${idx + 1}.jpg`]
      }))
    };

    fs.writeFileSync(targetPath, JSON.stringify(newHotel, null, 2) + "\n", "utf-8");
    console.log(`[CREATED] New hotel file created at ${targetPath}`);
  } catch (err) {
    console.error("Failed to scaffold new hotel file:", err);
    process.exit(1);
  }
}

if (process.argv[1]?.includes("new-hotel")) {
  createNewHotel();
}
