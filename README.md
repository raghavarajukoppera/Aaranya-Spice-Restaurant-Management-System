# Aaranya Spice — Restaurant Management System

_"Where Every Meal Feels Like Home"_

A production-styled Restaurant POS built with **Next.js 15 (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**. State is currently managed with React Context (`useState`/`useContext`); the data layer is structured so it can be swapped for MongoDB + Prisma later without touching the UI.

## Getting started

This project was built in an offline sandbox, so dependencies have **not** been installed or the build verified — do that first on your machine:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects to `/login`.

## Demo logins

| Role    | Username | Password    | Lands on             |
|---------|----------|-------------|-----------------------|
| Admin   | admin    | admin123    | /admin/dashboard      |
| Waiter  | waiter   | waiter123   | /waiter/dashboard      |
| Kitchen | kitchen  | kitchen123  | /kitchen/dashboard     |
| Counter | counter  | counter123  | /counter/dashboard     |

Tap the role tile on the login screen to auto-fill credentials.

## What's implemented

**Data persistence**
- Orders, table statuses, payments, the menu, and staff attendance are now saved to the browser's `localStorage` and restored automatically — reloading the page (or closing and reopening the tab) no longer resets today's tables, orders, or earnings back to zero.
- Admin has a **"Reset Demo Data"** control at the bottom of the Dashboard to deliberately wipe everything back to the seed state when you want a clean slate (e.g. starting a fresh demo).

**Daily Excel report**
- Admin Dashboard and Admin → Staff both have an **"Export Today's Report"** button that downloads a multi-sheet `.xlsx` file (via the `xlsx` / SheetJS library, generated entirely in the browser — no server involved):
- **Summary** — headline numbers first (total revenue generated, total orders, top-selling item and its quantity), then a breakdown of dine-in vs. parcel, staff attendance counts **with the actual names of who's Present/Half Day/Absent/Not Marked**, GST/discount totals, and table occupancy
  - **Orders** — every order placed today with type, table/customer, waiter, item count, status, and totals
  - **Payments** — every bill generated today with method, discount, coupon, and amount
  - **Popular Items** — today's best sellers by quantity and revenue
  - **Staff Attendance** — every staff member's role, employment status, and today's attendance mark

**Counter (takeaway / parcel)**
- For walk-in customers who order directly at the counter — no table required
- "New Parcel Order" → capture customer name + optional phone → build the order from the same menu picker waiters use
- Send items to the kitchen as a batch, same live status tracking as dine-in
- Unlike the waiter role, Counter can **generate the bill and collect payment directly** (discount, coupon, GST, 4 payment modes, printable receipt) — no admin approval step, since it's billed at the point of sale
- A **"Recent Bills"** list shows already-billed parcel orders with a **Print Bill** button to reopen and reprint/re-save any past receipt, even after the order is closed
- An **"Export Today's Report"** button downloads a parcel-only Excel report (summary, parcel orders, payments, best sellers) — scoped to just the counter's own bills, without restaurant-wide staff/table data
- Active parcel orders also show up in Admin's Billing page for oversight/backup billing, and Admin's own "Recent Payments" list now has the same reprint button

**Admin**
- Dashboard: live stat cards (revenue, orders, table occupancy, pending kitchen items), Sales Overview / Popular Items / Category Sales charts (Recharts), Quick Actions
- Menu Management: full CRUD, search, category filter, pagination, veg/non-veg tagging, availability toggle
- Table Management: 12 tables, color-coded status (Available/Occupied/Reserved/Cleaning), manual status override
- Kitchen View: read-only live ticket board
- Billing: generate invoices from any active table, discount + coupon code + GST, 4 payment modes (incl. Split), printable/PDF-able receipt (via browser print), payments history
- Staff directory

**Waiter**
- Interactive floor plan (12 tables, color-coded, live "items in kitchen" badge)
- A table stays **Available** until the waiter actually sends an order to the kitchen — opening the order screen alone no longer occupies it
- Browse menu with search/category **and meal-time filters** (Morning / Afternoon / Dinner / All Day — defaults to whichever period it currently is)
- Add items with quantity + special instructions, send items to kitchen as a batch
- Live per-item kitchen status, sorted so **Pending shows first and Ready shows last**
- Waiter can **mark a Ready item as Served** once it's delivered to the table
- Edit customer notes, request bill (billing itself is admin-only, enforced in the UI)

**Kitchen**
- Live ticket board grouped by table, oldest-first, and within each ticket **Pending items are shown first, Ready items last**
- Advance each item Pending → Preparing → Ready → Served, instantly reflected on the waiter's order screen (shared Context state)

**Shared UI kit**: glassmorphism cards, toasts, modals, confirm dialogs, skeletons, badges — all built on a custom "spice market" design system (see `tailwind.config.ts`).

## Not yet wired up (flagged for the next iteration)

- **Persistence**: state currently lives in memory (+ session in `localStorage`) and resets on a hard refresh of data. Swap `context/RestaurantContext.tsx`'s `useState` calls for data fetched from API routes backed by Prisma/MongoDB using the same shape defined in `lib/types.ts`.
- Real PDF export (currently uses the browser print dialog, which supports "Save as PDF").
- Auth is intentionally hardcoded per the brief — no real sessions/JWT yet.

## Folder structure

```
app/            routes (login, admin/*, waiter/*, kitchen/*)
components/
  admin/        admin-only widgets (charts, menu table, table grid, billing)
  waiter/       floor plan, order panel, menu picker
  counter/      parcel/takeaway order flow (new order modal, order panel)
  kitchen/      kitchen board & ticket
  shared/       billing form & receipt view shared by admin + counter
  layout/       Sidebar, Topbar, DashboardShell, ProtectedRoute
  ui/           Button, Card, Modal, Input, Select, Badge, Toast, etc.
context/        AuthContext, RestaurantContext (orders/tables/kitchen/billing), ToastContext
data/           seed menu, tables, staff
lib/            types, utils, hardcoded auth
```


## Deploy to Vercel

This project is optimized for **Vercel + Next.js**. It does not require a database or server environment for the current demo because application data is stored in the browser's `localStorage`.

### 1. Push the updated project to GitHub

From the project folder:

```bash
npm install
npm run build
git add .
git commit -m "Prepare Aaranya Spice for Vercel"
git push
```

### 2. Import the repository into Vercel

In Vercel, choose **Add New → Project**, select the GitHub repository, and deploy it.

Vercel should detect:
- Framework: Next.js
- Build command: `npm run build`
- Node.js: 20
- Install command: `npm install`

No environment variables are required for the current demo.

### Important data note

The current application uses browser `localStorage`. That means each browser/device has its own demo data; orders created on one device are not automatically visible on another device. For a real restaurant deployment, the next step would be a shared database and server-side authentication/API layer.

### Mobile support

The desktop layout and visual design are preserved. On phones, the dashboard gets a compact bottom navigation bar, larger touch-friendly controls, safe-area spacing, and horizontally scrollable data tables where needed.
