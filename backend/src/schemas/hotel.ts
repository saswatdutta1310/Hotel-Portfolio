import { z } from "zod";

export const GeoSchema = z.object({
  lat: z.number().nullable(),
  lng: z.number().nullable()
});

export const ContactSchema = z.object({
  phone: z.string().min(1),
  whatsapp: z.string().min(1),
  email: z.string().min(1)
});

export const StartingPriceSchema = z.object({
  amount: z.number().nullable(),
  currency: z.string().min(1),
  note: z.string().min(1)
});

export const RoomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  bed: z.string().min(1),
  sizeSqFt: z.number().nullable(),
  maxGuests: z.number().int().positive(),
  amenities: z.array(z.string()),
  pricePerNight: z.number().nullable(),
  images: z.array(z.string())
});

export const GalleryItemSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  category: z.string().min(1)
});

export const NearbyItemSchema = z.object({
  name: z.string().min(1),
  distance: z.string().min(1),
  mode: z.string().min(1)
});

export const FaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1)
});

export const ReviewItemSchema = z.object({
  author: z.string().min(1),
  text: z.string().min(1),
  source: z.string().min(1),
  rating: z.number().min(0).max(5)
});

export const SocialSchema = z.object({
  instagram: z.string(),
  facebook: z.string()
});

export const ThemeSchema = z.object({
  primary: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be valid hex color"),
  accent: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be valid hex color")
});

export const AddressSchema = z.object({
  street: z.string().min(1),
  area: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  country: z.string().min(1)
});

// slug must be kebab-case: lowercase letters, numbers, and hyphens (e.g., sample-hotel)
const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const HotelSchema = z.object({
  slug: z.string().regex(KEBAB_CASE_REGEX, "Slug must be in kebab-case format"),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  businessType: z.literal("hotel"),
  address: AddressSchema,
  geo: GeoSchema,
  contact: ContactSchema,
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  startingPrice: StartingPriceSchema,
  rooms: z.array(RoomSchema),
  amenities: z.array(z.string()),
  gallery: z.array(GalleryItemSchema),
  nearby: z.array(NearbyItemSchema),
  houseRules: z.array(z.string()),
  faqs: z.array(FaqItemSchema),
  reviews: z.array(ReviewItemSchema),
  googleBusinessUrl: z.string().min(1),
  social: SocialSchema,
  theme: ThemeSchema
});

export const HotelSummarySchema = z.object({
  slug: z.string().regex(KEBAB_CASE_REGEX, "Slug must be in kebab-case format"),
  name: z.string().min(1),
  tagline: z.string().min(1),
  city: z.string().min(1),
  startingPrice: StartingPriceSchema,
  heroImage: z.string().min(1)
});

export type Hotel = z.infer<typeof HotelSchema>;
export type HotelSummary = z.infer<typeof HotelSummarySchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Geo = z.infer<typeof GeoSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type StartingPrice = z.infer<typeof StartingPriceSchema>;
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type NearbyItem = z.infer<typeof NearbyItemSchema>;
export type FaqItem = z.infer<typeof FaqItemSchema>;
export type ReviewItem = z.infer<typeof ReviewItemSchema>;
export type Social = z.infer<typeof SocialSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
