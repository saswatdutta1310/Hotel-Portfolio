# API contract

Base URL in development: http://localhost:4000. Frontend: http://localhost:3000.
All responses are JSON. Errors: { "error": { "code": "NOT_FOUND", "message": "..." } }

## Endpoints
| Method | Path | Response |
|---|---|---|
| GET | /health | { "status": "ok" } |
| GET | /api/hotels | { "hotels": HotelSummary[] } |
| GET | /api/hotels/:slug | Hotel, or a 404 error |
| POST | /api/enquiry | { "ok": true }, or error |
| POST | /api/track | (later task) |

## HotelSummary
slug, name, tagline, city, startingPrice, heroImage

## POST /api/enquiry
Request: JSON body, max 10kb, Content-Type application/json.

Fields:
- hotelSlug: string, required, kebab-case, must match an existing hotel slug
- name: string, required, 2 to 80 characters after trimming
- phone: string, optional, 7 to 20 characters, digits, spaces, +, -, ( ) only
- email: string, optional, valid email, max 120 characters
- At least one of phone or email is required.
- checkIn: string, optional, date in YYYY-MM-DD format, not in the past
- checkOut: string, optional, date in YYYY-MM-DD format, after checkIn; if checkOut is sent, checkIn is required
- guests: integer, optional, 1 to 20
- message: string, optional, max 1000 characters
- website: string, honeypot. Real visitors never fill it. The field must be present in the schema, hidden in the form, and may be empty or missing.

All strings are trimmed. Control characters are rejected. Unknown fields are rejected.

Success: HTTP 200 with `{ "ok": true }`.
If the honeypot field "website" is non-empty, return the same success response and send nothing.

Errors:
- 400 VALIDATION_ERROR: body failed validation; message is generic and never echoes user input
- 404 NOT_FOUND: hotelSlug does not match any hotel
- 413 PAYLOAD_TOO_LARGE: body over 10kb
- 429 RATE_LIMITED: more than 5 enquiries per IP per hour
- 502 EMAIL_FAILED: the email could not be sent; no internal details

Behaviour notes: the backend emails the hotel's own enquiry address from the hotel data, and never stores or logs the message text, phone or email. No booking or payment is created. This is an enquiry only.

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
