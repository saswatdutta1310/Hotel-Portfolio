# Architecture

Two independent apps in one repo.

- backend/ owns the hotel content (JSON files) and serves it over a REST API. It
  also receives enquiry-form submissions (emailed to the hotel) and contact-click
  events.
- frontend/ is a statically generated Next.js site. It fetches hotel data from the
  backend on the server and never holds secrets.

Development ports: frontend 3000, backend 4000. The frontend can run on mock data
(USE_MOCK=true) so the two apps can be built separately.

Deployment: frontend on Vercel, backend on Render or Railway.
