# API contract

Base URL in development: http://localhost:4000. Frontend: http://localhost:3000.
All responses are JSON. Errors: { "error": { "code": "NOT_FOUND", "message": "..." } }

## Endpoints
| Method | Path | Response |
|---|---|---|
| GET | /health | { "status": "ok" } |
| GET | /api/hotels | { "hotels": HotelSummary[] } |
| GET | /api/hotels/:slug | Hotel, or a 404 error |
| POST | /api/enquiry | (later task) |
| POST | /api/track | (later task) |

## HotelSummary
slug, name, tagline, city, startingPrice, heroImage

## Hotel
    slug: string (kebab-case, unique)
    name, tagline, description: string
    businessType: "hotel"
    address: { street, area, city, state, pincode, country: string }
    geo: { lat: number|null, lng: number|null }
    contact: { phone, whatsapp, email: string }   // "TODO" when unknown
    checkIn, checkOut: string                      // e.g. "12:00 PM"
    startingPrice: { amount: number|null, currency: string, note: string }
    rooms: [{ id, name, description, bed: string, sizeSqFt: number|null,
              maxGuests: number, amenities: string[], pricePerNight: number|null,
              images: string[] }]
    amenities: string[]
    gallery: [{ src, alt, category: string }]
    nearby: [{ name, distance, mode: string }]    // e.g. "10 min", "walk"
    houseRules: string[]
    faqs: [{ question, answer: string }]
    reviews: [{ author, text, source: string, rating: number }]
    googleBusinessUrl: string                      // "TODO" when unknown
    social: { instagram, facebook: string }
    theme: { primary, accent: string }             // hex colors

Image paths (heroImage, rooms[].images, gallery[].src) are site-relative paths
such as /hotels/sample-hotel/hero.svg. The images live in the frontend's public/
folder.

## Sample data
backend/data/hotels/ holds _template.json, sample-hotel.json and
sample-guesthouse.json: fictional hotels in invented locations.
