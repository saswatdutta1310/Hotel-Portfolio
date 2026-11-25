import { z } from "zod";

export const AddressSchema = z.object({
  street: z.string(),
  area: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  country: z.string(),
});

export const GeoSchema = z.object({
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});

export const ContactSchema = z.object({
  phone: z.string(),
  whatsapp: z.string(),
  email: z.string(),
});

export const StartingPriceSchema = z.object({
  amount: z.number().nullable(),
  currency: z.string(),
  note: z.string(),
});

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  bed: z.string(),
  sizeSqFt: z.number().nullable(),
  maxGuests: z.number(),
  amenities: z.array(z.string()),
  pricePerNight: z.number().nullable(),
  images: z.array(z.string()),
});

export const GalleryItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  category: z.string(),
});

export const NearbyItemSchema = z.object({
  name: z.string(),
  distance: z.string(),
  mode: z.string(),
});

export const FaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const ReviewSchema = z.object({
  author: z.string(),
  text: z.string(),
  source: z.string(),
  rating: z.number(),
});

export const SocialSchema = z.object({
  instagram: z.string(),
  facebook: z.string(),
});

export const ThemeSchema = z.object({
  primary: z.string(),
  accent: z.string(),
});

export const HotelSchema = z.object({
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  businessType: z.literal("hotel"),
  address: AddressSchema,
  geo: GeoSchema,
  contact: ContactSchema,
  checkIn: z.string(),
  checkOut: z.string(),
  startingPrice: StartingPriceSchema,
  rooms: z.array(RoomSchema),
  amenities: z.array(z.string()),
  gallery: z.array(GalleryItemSchema),
  nearby: z.array(NearbyItemSchema),
  houseRules: z.array(z.string()),
  faqs: z.array(FaqSchema),
  reviews: z.array(ReviewSchema),
  googleBusinessUrl: z.string(),
  social: SocialSchema,
  theme: ThemeSchema,
  heroImage: z.string().optional(),
});

export const HotelSummarySchema = z.object({
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  city: z.string(),
  startingPrice: StartingPriceSchema,
  heroImage: z.string(),
});

export type Address = z.infer<typeof AddressSchema>;
export type Geo = z.infer<typeof GeoSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type StartingPrice = z.infer<typeof StartingPriceSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type NearbyItem = z.infer<typeof NearbyItemSchema>;
export type Faq = z.infer<typeof FaqSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Social = z.infer<typeof SocialSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Hotel = z.infer<typeof HotelSchema>;
export type HotelSummary = z.infer<typeof HotelSummarySchema>;
