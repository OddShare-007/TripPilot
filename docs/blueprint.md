# TripPilot — Full Product Blueprint (v1.0 + Build Decisions)

This file is the plain-text reference version of `TripPilot_Product_Blueprint_v1.0.pdf`,
for Cursor to read directly. It also includes the additional build decisions made after
the original blueprint. Keep this file updated as decisions evolve — CONTEXT.md stays as
the short summary, this file is the full detail.

---

## What Is TripPilot?

TripPilot is NOT an airline booking platform and does not sell tickets. It is an
AI-powered Travel Management Assistant that sits on top of existing booking platforms.
It helps users search flights, compare prices across multiple sources, organise every
booking (regardless of where it was made) in one place, manage passenger information,
and monitor their journeys — all from a single dashboard.

**Name meaning:**
- "Trip" = the user's whole journey, not just flights — allows future growth into hotels,
  trains, buses, visas, insurance, etc.
- "Pilot" = the AI assistant that guides the user, the way a pilot guides a plane.

---

## Executive Summary

- **Why it exists:** Travellers book across many different platforms, and once booked,
  all record of the trip is scattered across emails, PDFs, and apps. TripPilot becomes
  the single source of truth.
- **Problem solved:** "Travel information chaos" — comparing prices before booking, and
  auto-organising confirmations after booking.
- **Different from airline/OTA apps:** Those only show their own bookings. TripPilot
  imports and unifies bookings from ANY source, with a built-in AI assistant.

---

## Problem Statement (and how TripPilot solves each)

| Problem | Solution |
|---|---|
| Searching many websites | AI Flight Search checks multiple sources at once |
| Comparing prices manually | AI Price Comparison ranks by price/stops/duration |
| Keeping/finding booking emails | Booking Import reads and saves details permanently |
| Losing PNR numbers | PNR extracted and always visible |
| Managing multiple trips | Dashboard separates upcoming/current/past/cancelled |
| Tracking reservation status | Live Flight Tracking (delayed, boarding, etc.) |
| Finding terminal/gate | Stored in Flight Details, with change alerts |
| Remembering baggage allowance | Saved and shown per booking |
| Managing passenger details | Passenger Management stores and reuses info |

---

## Objectives

1. Search and compare flights across multiple platforms from one place.
2. Automatically extract booking details from confirmation emails/PDFs via AI + OCR.
3. Provide one organised dashboard for all trips, regardless of booking source.
4. Securely store and reuse passenger information across bookings.
5. Give real-time updates on flight status, gate changes, delays.
6. Offer an AI Travel Assistant that answers questions in plain language.
7. Build a system that is secure, reliable, and easy to expand with future travel services.

---

## Target Audience

Business Travellers, Families, Students, Frequent Flyers, Travel Enthusiasts,
Corporate Employees, Travel Managers.

---

## Core Features

### AI Flight Search
User types a natural request (e.g. "Delhi to Mumbai next Friday morning"). AI turns
this into a structured search and queries flight data providers.

### AI Price Comparison
AI ranks results from multiple sources by price, stops, duration, and airline.

### Flight Details — full field list
Flight Number, Airline, Aircraft Type, Departure Airport, Arrival Airport, Departure
Terminal, Arrival Terminal, Departure Gate, Arrival Gate, Flight Duration, Stops,
Layover Details, Fare, Seat Availability, Cabin Class (Economy/Premium Economy/
Business/First), Meal, Baggage Allowance, Refund Policy, Cancellation Policy, Flight
Status (On Time/Delayed/Boarding/Departed/Arrived), PNR/Booking Reference, Booking
Website/Airline Name.

### Passenger Management — full field list
Name, Age, Gender, Phone, Email, Passport, Government ID, Emergency Contact,
Frequent Flyer Number, Travel Preferences.

### Reservation Dashboard
Upcoming Trips, Current Trips, Past Trips, Cancelled Trips, Travel History, Statistics.

### Booking Import
User uploads booking PDF, boarding pass, or confirmation email. AI + OCR extract
passenger name, flight number, PNR, seat, dates, etc., and save to the dashboard.

### Flight Tracking
Live status: Boarding, Delayed, Departed, Arrived, Gate Change, Terminal Change.

### Notifications
Flight reminders, gate/terminal update alerts, delay/cancellation alerts, check-in
open reminders.

### AI Travel Assistant
Answers plain-language questions, e.g.:
"Find my cheapest flight", "Show my next journey", "When should I leave for the
airport?", "Which airline has fewer stops?", "Show my cancelled trips".

### Admin Dashboard
Registered Users, Imported Bookings, Flight Records, Popular Routes, Reservation
Statistics, User Activity, System Monitoring.

---

## Complete User Workflow

1. User searches for a flight in plain language.
2. AI understands the request and builds a structured search.
3. Flight data APIs are called for matching flights.
4. Results are compared and shown to the user.
5. User books the ticket on the airline/provider's own website (TripPilot never sells
   tickets).
6. Confirmation email/PDF arrives in the user's inbox.
7. User uploads the PDF or forwards the email to TripPilot.
8. AI + OCR extract flight, passenger, and PNR details.
9. Database stores the structured booking data.
10. Reservation Dashboard updates automatically.
11. AI Travel Assistant can now answer questions about this trip.

---

## AI Integration (concept)

The AI is the middleman between the user and all technical systems:
User asks in plain language → AI understands intent (search/compare/track/ask) →
AI calls Flight APIs / reads uploaded PDF via OCR / queries the Database → AI combines
results into one clear answer → shown to user in dashboard or chat.

---

## System Architecture

User (Web/Mobile) → Frontend → AI Assistant Layer → Backend/Server → 
[Flight APIs, OCR Engine, Email Parser, Database] → Dashboard
(Reservations, Passengers, Tracking, Notifications)

---

## Database Design

**Suggested tables:** Users, Passengers, Reservations, Flights, Flight Status,
Notifications, Travel History.

**Relationships (simple):** One User → many Passengers, many Reservations. Each
Reservation → linked to one Flight. Each Flight → has a live Flight Status. Completed
Reservations move into Travel History. Important updates generate Notifications.

---

## APIs

An API lets two systems talk to each other (like a waiter carrying your order to the
kitchen and bringing back the food). Used because flight schedules/prices/seats change
constantly and need real-time, trusted data. Examples only: Amadeus, Skyscanner.

---

## OCR & Email Parsing

OCR = Optical Character Recognition — lets a computer read text from an image or
scanned document.

Flow: User uploads confirmation email/PDF → OCR/Email Parser reads the text → AI
identifies which text is which detail → extracted details are checked/cleaned →
stored in the Database.

Details extracted: PNR, Passenger Name, Flight Number, Airline, Seat, Terminal, Date,
Time.

---

## Algorithms Used (simple explanations)

- **Binary Search:** Fast way to find something in a sorted list by repeatedly checking
  the middle and eliminating half each time. Used to quickly find a specific flight or
  booking in a large sorted list.
- **Merge Sort:** Splits a list into pieces, sorts each, merges back in order. Stays
  reliably fast on large lists. Used for sorting large flight search results.
- **Quick Sort:** Picks a "pivot," arranges smaller items on one side, larger on the
  other, repeats. Fast in practice for everyday-sized lists. Used for sorting the price
  comparison screen.
- **Hash Maps:** Lets the computer jump straight to data via a unique key instead of
  searching everything. Used to instantly look up a booking via PNR.
- **Queue:** First item in is the first one processed. Used to process uploaded booking
  PDFs in the order received.
- **Priority Queue:** Most important item is processed first, regardless of arrival
  order. Used to send urgent alerts (e.g. gate change) before routine notifications.
- **Graphs:** Represents connections between things (airports connected by routes).
  Used to represent airport networks, especially for layovers.
- **Dijkstra's Algorithm:** Finds the shortest/cheapest/fastest path between two points
  in a graph. Used to suggest the fastest/cheapest multi-stop route.
- **Big O Notation:** Describes how much slower a program gets as data grows. Used
  during development to keep search/sort/lookup fast as data grows.

---

## Recommended Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React / React Native |
| Backend | Node.js + Express, or Python + FastAPI |
| Database | PostgreSQL + Redis (caching) |
| Authentication | OAuth 2.0 / JWT |
| AI | LLM API (e.g. Claude) |
| OCR | Tesseract OCR or a cloud OCR service |
| Cloud | AWS / Google Cloud / Azure |
| Notifications | Firebase Cloud Messaging / email & SMS gateway |
| Analytics | Google Analytics / Mixpanel |
| Hosting | Cloud container hosting (AWS ECS, Google Cloud Run) |
| Deployment | Docker |
| CI/CD | GitHub Actions / GitLab CI |
| Monitoring | Grafana, Prometheus |

---

## Security

Authentication (hashed passwords, optional 2FA), Encryption (in transit + at rest),
Secure APIs (authenticated, rate-limited), Privacy (passport/ID treated as highly
sensitive), Data Protection compliance, regular Database Backups, Role-Based Access
(user/travel manager/admin).

---

## Future Features (post-MVP)

Hotel Management, Train Tickets, Bus Tickets, Visa Tracking, Travel Insurance, Currency
Converter, Expense Manager, Calendar Sync, Offline Tickets, AI Itinerary Planner, Travel
Recommendations.

---

## Development Roadmap (original 9-phase vision)

Research & Market Study → UI/UX Design → Backend & Database Development → Frontend
Development → AI Integration → Testing & QA → Deployment → Commercial Launch → Future
Scaling.

---

## AI-Assisted Development

Tools like Claude, ChatGPT, GitHub Copilot, Cursor, Windsurf, Replit AI can speed up
building TripPilot, but human review, testing, and deployment decisions are still
required.

---

# BUILD DECISIONS (post-blueprint, current MVP scope)

These decisions refine the original 9-phase roadmap into one practical MVP, since the
builder has no coding background and is using AI automation tools (Cursor) to build.

## Current MVP Implementation (completed)

The MVP has been built and is fully functional. Here's what was implemented and the key architectural decisions:

### 1. Auth Flow
- **Landing page** (`/`) — animated TripPilot logo entrance, one-line value statement, "Get Started" button, and "Sign in" link. Uses `GuestRoute` wrapper to redirect authenticated users.
- **Sign Up page** (`/signup`) — 3 fields only (email, password, confirm password). Password visibility toggle, validation (email format, password length ≥6, passwords match), disabled button until valid. Links to Login.
- **Login page** (`/login`) — wired to AuthContext. Real error states (wrong password, no account found). Password visibility toggle. Routes to Dashboard (if onboarding completed) or onboarding (if not). Links to Sign Up.
- **Onboarding** (`/onboarding`) — 2-step wizard selecting traveller type (Business/Family/Student/Frequent Flyer) and priority (Price/Speed/Comfort). Saves to AuthContext and routes to Dashboard.
- All forms use `e.preventDefault()` + `noValidate` for custom validation UI.
- localStorage for mock data; `authService` and `AuthContext` are structured as interface objects so swapping to a real backend requires no component changes — only the service implementation.

### 2. Theme Toggle
- Sun/moon icon in the top bar (within `TopNav` component).
- Uses `darkMode: 'class'` in Tailwind config.
- Persists choice in localStorage.
- Toggles `<html class="dark">` on change.
- Applied across the entire app — all pages, all cards, all forms.

### 3. Collapsible Sidebar
- Hamburger icon in top-left of top bar toggles sidebar.
- CSS transition for smooth slide-in/out (300ms ease-in-out).
- Mobile: overlay + close on backdrop click / close button.
- Desktop: default open, no overlay.
- Sidebar items: Overview (`/dashboard`), Trips (`/trips`), Schedule (`/schedule`), Analytics (`/analytics`), AI Assistant (`/assistant`), Add Trip Data (`/add-trip`), Settings (`/dashboard`), Help (`/dashboard`).

### 4. Data Entry — Add Trip Data (`/add-trip`)
**Tab A — Manual Entry:**
- Full flight form with 22+ fields matching the blueprint field list exactly.
- Full passenger form with 10 fields.
- All stored via `TripContext.addTrip()` → `tripService.addTrip()` → localStorage.
- Validates required fields (flight number, route, passenger name).
- After save, resets form and navigates to Dashboard.

**Tab B — Import Booking:**
- File upload accepts PDF/PNG/JPG/EML. Tesseract.js reads images and the first PDF page, then parsed fields are editable before save.
- Imported trips are stored alongside manual trips with an `imported` source tag.
- PNR lookup gives a clear provider-API limitation message until a flight API is connected.

### 5. Shared Data Layer
- Single `TripContext` wraps all trip-related state.
- `tripService` handles CRUD operations on localStorage.
- `AuthContext` wraps authentication state.
- All pages read from / write to the same contexts.
- Services (`authService`, `tripService`) are exposed as const objects with typed methods — not classes — so they can be swapped out when a real backend is added, without refactoring providers.

### 6. Dashboard (fully wired)
- **Stat cards**: Upcoming count, total spent (INR formatted), unique routes, days until next departure.
- **Trip tables**: Upcoming, Current, Past, Cancelled — using `TripListCard` with real data and clean empty states.
- **Charts**: Spending over time (bar chart), Trips per month (bar chart), Popular routes (horizontal bar chart). All use existing `BarChart` and `PopularRoutesChart` components.
- **Search**: Functional search bar that filters trips by flight number, route, PNR, airline, airport, or passenger name. Shows dropdown with top 5 results.

### 7. AI Assistant
- A server-side development endpoint sends Groq a concise view of the current user's saved trips.
- Live/current questions use Tavily when configured, and chat labels web-search answers.
- `GROQ_API_KEY` and `TAVILY_API_KEY` are read only from `.env`; `.env.example` documents setup.

### 7a. Supporting trip pages
- **Trips** presents the four booking categories from the shared local data store.
- **Schedule** orders saved flights by departure time.
- **Analytics** presents the same spending, monthly-trip, and popular-route data as
  the dashboard.

### 8. "Demo Mode" Banner
- Shown across the app (rendered via `DemoBanner` component in `TopNav`).

## Build Order (completed)

1. ✅ Project skeleton — React + Vite + TypeScript, Tailwind, folder structure, routing
2. ✅ Database + sample data — all flight and passenger fields in localStorage
3. ✅ Auth flow — landing, signup, login, onboarding all wired
4. ✅ Dashboard — real data from TripContext, stat cards, tables, charts
5. ✅ Add Trip Data — manual entry form + import booking tab UI
6. ✅ Theme toggle — light/dark mode with persistence
7. ✅ Collapsible sidebar — hamburger trigger, slide animation, mobile overlay
8. ✅ Documentation updated

## Key Technical Decisions

- **No external state library needed** — React Context + useCallback + custom hooks are sufficient for the MVP's data complexity.
- **localStorage as persistence** — all structured data is serialized as JSON. Storage keys are prefixed with `trippilot:` to avoid collisions.
- **SHA-256 for mock password hashing** — uses Web Crypto API (`crypto.subtle.digest`). This is NOT production-grade but mirrors the async shape of a real bcrypt call.
- **Tailwind dark mode** — `darkMode: 'class'` strategy, so toggling is instant and server-side rendering is compatible.
- **Password visibility toggle** — implemented as a reusable `PasswordField` component with eye/eye-off icons from lucide-react.
- **Route guards** — `ProtectedRoute` (auth + onboarding required), `GuestRoute` (no auth), `OnboardingRoute` (auth but no onboarding) — all with loading spinner states.
- **PNR is always uppercase** — normalized on input and on lookup.
- **Default sidebar state** — desktop open, mobile closed, with resize listener.

## Deferred to Later Phases (not in current MVP)

- OCR / email parsing for real booking import.
- Real flight APIs (Amadeus, Skyscanner, etc.) — require business registration/paid contracts.
- Admin Dashboard (analytics for the TripPilot team).
- All "Future Features" listed above (hotels, trains, buses, visas, insurance, etc.).

## Design Direction

Modern, professional 2026 SaaS/travel product look — similar to Linear, Notion, or a premium travel app:
- Clean layout, generous whitespace, modular card-based sections.
- Subtle borders instead of heavy shadows; calm colour palette (deep blue/teal, travel-themed).
- Professional icon set (lucide-react), clean modern font (Inter or similar).
- Polished logo/top bar with a plane icon. No clip-art icons, no generic template look.

## Routes Reference

| Path | Page | Access | Notes |
|---|---|---|---|
| `/` | LandingPage | Guest | Animated logo + CTA |
| `/signup` | SignUpPage | Guest | 3-field form |
| `/login` | LoginPage | Guest | AuthContext wired |
| `/onboarding` | OnboardingPage | OnboardingRoute | 2-step wizard |
| `/dashboard` | DashboardPage | Protected | Real data from TripContext |
| `/add-trip` | AddTripPage | Protected | Manual entry + import tabs |
| `/trips` | TripsPage | Protected | Categorised saved bookings |
| `/schedule` | SchedulePage | Protected | Flights ordered by departure |
| `/analytics` | AnalyticsPage | Protected | Shared-data charts |
| `/assistant` | AssistantPage | Protected | Local saved-trip questions |
| `*` | Redirect → `/` | Any | Catch-all |

## Working Notes

- Builder has zero coding background — every Cursor prompt should explain what it's doing in simple terms, and confirm the exact command + URL to run/view the result.
- CONTEXT.md (short summary) + this file (full detail) should both be kept up to date as new decisions are made, so any future Cursor session can regain full context without the builder re-explaining everything from scratch.
