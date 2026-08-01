# TripPilot — Project Context

**PROJECT:** TripPilot — AI-powered travel management assistant.

It is **NOT** a booking platform. It helps users track and manage flights they've already booked elsewhere, compare info, and get AI answers about their trips.

---

## BUILD STATUS (completed MVP)

### Auth Flow
- Landing page (`/`) — animated logo, value statement, "Get Started" button, "Sign in" link
- Sign Up page (`/signup`) — 3 fields (email, password, confirm password), validation, error states, password visibility toggle, disabled button until valid
- Login page (`/login`) — wired to AuthContext, error states, password toggle, routes based on onboarding completion
- Onboarding (`/onboarding`) — 2-step wizard (traveller type + priority), saves preferences to AuthContext, redirects to Dashboard
- Uses **localStorage** for mock accounts and sessions; structured so real backend can replace without rewrite

### Theme Toggle
- Sun/moon icon in top bar (via `useTheme`)
- Switches entire app colour scheme using Tailwind's `darkMode: 'class'` strategy
- Persists choice in localStorage

### Collapsible Sidebar
- Hamburger icon in top-left of top bar
- Slides in/out smoothly with CSS transitions
- Contains: Overview, Trips, Schedule, Analytics, AI Assistant, Add Trip Data + Settings, Help
- Desktop: default open; Mobile/small screens: default closed with overlay

### Data Entry (Add Trip Data — `/add-trip`)
**Tab A — Manual Entry:**
- Full flight form: PNR, Flight Number, Airline, Aircraft Type, Source/Destination Airport, Terminals, Gates, Departure/Arrival Times, Duration, Stops, Fare, Seat, Cabin Class, Meal, Baggage, Refund/Cancellation Policy, Status, Booking Website
- Full passenger form: Name, Age, Gender, Phone, Email, Passport, Government ID, Emergency Contact, Frequent Flyer Number, Travel Preferences
- Save button stores to shared TripContext/localStorage → immediately visible on Dashboard

**Tab B — Import Booking:**
- Client-side OCR reads PDF first pages, PNG/JPG images, and EML text; parsed fields are editable before saving an imported trip
- PNR lookup clearly explains that a provider API is required

### Shared Data Layer
- `TripContext` + `tripService` provide a single source of truth backed by localStorage
- `AuthContext` + `authService` for user accounts and sessions
- All pages (Dashboard, Add Trip Data) read from / write to the same store
- Services are structured as interface objects so real API calls can replace them later

### Dashboard (fully wired)
- Real stat cards: upcoming count, total spent, routes flown, next departure
- Real trip tables: Upcoming, Current, Past, Cancelled (via `filterTripsByCategory`)
- Real charts: Spending over time, Trips per month, Popular routes (via `tripUtils`)
- Clean empty state when no trips exist
- Functional search bar that filters trips by flight number, route, PNR, airline, airport, passenger name

### AI Assistant
- Groq answers with the current user's saved-trip context through a server-side endpoint
- Tavily supports live flight questions; web-backed answers are labelled in chat
- API keys are read from `.env`, never client code or version control

### "Demo Mode" banner
- Shown everywhere since we start with sample data only

### Deferred to later phase
- OCR / email parsing for real booking import
- Real flight APIs (Amadeus/Skyscanner) — require business registration
- Admin Dashboard

---

## DESIGN DIRECTION

Modern, professional 2026 SaaS/travel product — similar to Linear, Notion, or a premium travel app.

- Clean layout, generous whitespace, modular card-based sections
- Subtle borders instead of heavy shadows
- Calm colour palette (deep blue/teal, travel-themed)
- Professional icon set (`lucide-react`)
- Clean modern font (Inter or similar)
- Polished logo/top bar with a plane icon
- No clip-art style icons, no generic template look

---

## Reference Files

- **Full detail:** `docs/blueprint.md`
- **This file:** short summary for quick context in every Cursor session
