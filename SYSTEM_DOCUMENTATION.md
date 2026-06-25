# Rivera's Auto Detailing — System Documentation

**Last updated:** June 2025  
**Stack:** Vite + React + TypeScript + Tailwind CSS + Supabase (database only)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [User Roles & Permissions](#2-user-roles--permissions)
3. [Admin Account Tiers](#3-admin-account-tiers)
4. [Authentication System](#4-authentication-system)
5. [Public Website Routes](#5-public-website-routes)
6. [Dashboard — Feature Map](#6-dashboard--feature-map)
7. [Service Request Lifecycle](#7-service-request-lifecycle)
8. [Account Management](#8-account-management)
9. [Delete Behavior (Important)](#9-delete-behavior-important)
10. [Database Tables](#10-database-tables)
11. [Component Inventory](#11-component-inventory)
12. [Known Issues & Limitations](#12-known-issues--limitations)

---

## 1. Architecture Overview

Rivera's Auto Detailing is a full-stack web app with two distinct areas:

- **Public marketing site** — viewable by anyone, no login required
- **Private dashboard** — accessible only to authenticated team members

**Authentication** is handled entirely with a custom system — NOT Supabase Auth. Users are stored in a `users` table with SHA-256 hashed passwords. Sessions are persisted to `localStorage`.

**Database** uses Supabase as a hosted Postgres database only. There is no Row Level Security (RLS) enforced; all access control is handled client-side in the React app.

---

## 2. User Roles & Permissions

Three roles exist: `sales_rep`, `manager`, and `admin`.

### Sales Rep
| Capability | Access |
|---|---|
| Log in | ✅ |
| Submit new service requests | ✅ |
| View own requests only | ✅ |
| View other reps' requests | ❌ |
| Access dashboard admin tabs | ❌ |
| Create/manage accounts | ❌ |
| Financial cards (Amount Due/Paid) | ❌ unless `can_view_financial_cards = true` |

### Manager
All sales rep capabilities, plus:

| Capability | Access |
|---|---|
| Create `sales_rep` accounts | ✅ |
| Create `manager` accounts | ✅ |
| Create `admin` accounts | ❌ |
| View all requests | ❌ (still sees own only) |
| Access admin tabs | ❌ |

### Admin
All manager capabilities, plus:

| Capability | Access |
|---|---|
| View ALL requests across the dealership | ✅ |
| Search, filter, and export requests | ✅ |
| Edit any request (price, dates, services, notes) | ✅ |
| Bulk delete / hide requests | ✅ |
| Access Account Management tab | ✅ |
| Access Activity Log tab | ✅ |
| Create accounts of any role including `admin` | ✅ |
| Deactivate team member accounts | ✅ |
| Reset team member passwords | ✅ |
| Financial cards (Amount Due/Paid) | ✅ only if `can_view_financial_cards = true` |

---

## 3. Admin Account Tiers

Not all admin accounts have identical access. Financial visibility is controlled by a separate database flag.

| Email | Role | Financial Cards | Notes |
|---|---|---|---|
| `davisbryan595@gmail.com` | admin | ✅ Visible | Full access |
| `eliasrivera1884@gmail.com` | admin | ✅ Visible | Full access |
| `alexiszavaleta76@gmail.com` | admin | ❌ Hidden | No financial visibility |

**Financial cards** (Amount Due, Amount Paid) are controlled by the `can_view_financial_cards` column on the `users` table. Only accounts where this field is `true` will see those cards in the dashboard.

To change a user's financial card access, update their `can_view_financial_cards` field directly in Supabase.

---

## 4. Authentication System

### Login Flow
1. User enters email + password on `/login`
2. App queries `users` table by email
3. If `is_active = false`, login is rejected with an error
4. Password is hashed with SHA-256 using the browser Web Crypto API
5. Hash is compared to `password_hash` in the database
6. On success, user data is stored in React context and `localStorage` under key `dealership-session`

### Session Restore
On app load, if `dealership-session` exists in `localStorage` and contains a valid `user.id` and `user.role`, the session is restored without requiring re-login. Sessions missing either field are discarded, forcing a fresh login.

### Logout
Clears context state, request list, and removes `dealership-session` from `localStorage`.

### Password Reset (Forgot Password)
Self-service reset from the login page:
1. Enter email address
2. Answer the security question set during account creation
3. Enter and confirm a new password
4. New password is hashed and stored

### Password Reset (Admin-initiated)
Admins can reset any team member's password from the Account Management tab. A temporary password is generated and displayed once.

---

## 5. Public Website Routes

All routes below are public (no login required):

| Route | Page | Description |
|---|---|---|
| `/` | `Index.tsx` | Home page — hero, service previews, mobile detailing, certifications |
| `/about` | `About.tsx` | About section — experience, mission, outsourcing benefits |
| `/services` | `Services.tsx` | Full services catalog — main and additional services |
| `/gallery` | `Gallery.tsx` | Photo gallery with lightbox viewer |
| `/testimonials` | `Testimonials.tsx` | Client reviews with star ratings |
| `/faq` | `FAQ.tsx` | Frequently asked questions accordion |
| `/service-area` | `ServiceArea.tsx` | DMV service coverage map + WhatsApp CTA |
| `/trusted` | `Trusted.tsx` | Trusted partners and differentiators |
| `/login` | `Login.tsx` | Login + password reset |

### Protected Routes
| Route | Requirement |
|---|---|
| `/request` | Must be logged in |
| `/dashboard` | Must be logged in |

> Note: `/contact` — A contact page exists (`src/pages/Contact.tsx`) but is NOT registered as a route. Links to it throughout the site are currently broken.

---

## 6. Dashboard — Feature Map

### Tabs

| Tab | Who Can See It |
|---|---|
| Service Requests | All logged-in users |
| Account Management | Admins only |
| Activity Log | Admins only |

### Service Requests Tab — Sections

| Section | Who Can See It |
|---|---|
| Stats cards (Total, Pending, Completed) | All users |
| Amount Due card | Admins with `can_view_financial_cards = true` |
| Amount Paid card | Admins with `can_view_financial_cards = true` |
| New Request button | All users |
| New request notifications (bell) | Admins only |
| Search bar | Admins only |
| Department filter | Admins only |
| Bulk action buttons (delete, export, restore) | Admins only |
| Full request table with edit/delete | Admins only |
| Request cards (own requests only) | Non-admins only |

### Account Management Tab — Sections

| Section | Description |
|---|---|
| Create account form | Create new team members with any role |
| Team members list | View all active accounts in the dealership |
| Deactivate button | Marks user `is_active = false` — blocks login, preserves data |
| Reset password button | Generates and displays a temporary password |

### Activity Log Tab

Tracks account-level actions with timestamps:
- Account creation
- Account deactivation
- Password resets

---

## 7. Service Request Lifecycle

### Statuses
- `Pending` — request submitted, awaiting completion
- `Completed` — work done; auto-records completion date and time

### Create
Two entry points:
- `/request` page (standalone form)
- Dashboard new request form (slide-in panel)

Fields captured:
- Requester info (email, role, manager name)
- Vehicle details (year, make, model, color, stock/VIN)
- RO number (service department)
- PO number (sales department)
- Request type: `sales` or `service`
- Main services and additional services (multi-select)
- Notes
- Due date / due time
- Start date / start time
- Price (admin-only field)

### Update
Admins can edit any field on any request:
- Inline editing in the request table
- Full edit via the Request Detail modal

Non-admins cannot edit requests after submission.

### Delete / Hide (Important)
Service requests are **never permanently deleted from the database.** All "delete" actions are view-level only, stored in `localStorage` per user.

- **Single delete** — hides one request from your view
- **Delete selected** — hides checked requests from your view
- **Delete all** — hides all currently visible requests from your view
- **Delete by date range** — hides requests in a date range from your view
- **Restore** — clears your hidden list; all requests reappear

Because this is localStorage-based, hidden requests are per-device and per-user. Logging out on a different device will show all requests again.

---

## 8. Account Management

### Creating an Account
Admins fill out the Account Creation form in the Account Management tab:
- Name, email, role, security question/answer
- Password can be entered manually or auto-generated
- Password is SHA-256 hashed before storage

### Deactivating an Account
Sets `is_active = false` in the database. The user cannot log in but their data is preserved. This is reversible by updating the database directly in Supabase.

### What Cannot Be Done from the UI
- Editing an existing user's name, email, or role requires a direct database update in Supabase
- Permanently deleting a user row requires a direct database update in Supabase
- Changing `can_view_financial_cards` requires a direct database update in Supabase

---

## 9. Delete Behavior (Important)

| What | How it works | Reversible? | Hits Database? |
|---|---|---|---|
| Hide a service request | Stored in localStorage per user | ✅ Yes (Restore button) | ❌ No |
| Bulk hide requests | Same as above | ✅ Yes (Restore button) | ❌ No |
| Deactivate a user account | Sets `is_active = false` | ✅ Yes (via Supabase) | ✅ Yes |
| Permanently delete a user | Not available in the UI | N/A | N/A |
| Permanently delete a request | Not available in the UI | N/A | N/A |

---

## 10. Database Tables

### `users`
Stores all team member accounts.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `auth_id` | UUID | Unused (Supabase Auth not in use) |
| `dealership_id` | UUID | Links user to a dealership |
| `email` | text | Login identifier |
| `name` | text | Display name |
| `role` | text | `sales_rep`, `manager`, or `admin` |
| `is_active` | boolean | `false` = blocked from logging in |
| `password_hash` | text | SHA-256 hash of password |
| `security_question` | text | Used for self-service password reset |
| `security_answer` | text | Lowercased + trimmed at creation |
| `can_view_financial_cards` | boolean | Controls Amount Due/Paid visibility |
| `reset_token` | text | Unused |
| `reset_token_expires_at` | timestamp | Unused |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### `service_requests`
Stores all detailing service requests.

| Column | Notes |
|---|---|
| `id` | Auto-increment integer |
| `dealership_id` | Links request to dealership |
| `request_number` | Auto-generated (e.g. `REQ-001`) |
| `requested_by` | Email of submitting user |
| `requester_role` | Role at time of submission |
| `manager` | Manager name (entered manually) |
| `stock_vin` | Vehicle stock or VIN number |
| `po_number` | Purchase order number (sales dept) |
| `ro_number` | Repair order number (service dept) |
| `vehicle_description` | Free text |
| `year`, `make`, `model`, `color` | Vehicle details |
| `main_services` | Array of selected main services |
| `additional_services` | Array of additional services |
| `notes` | Free text notes |
| `status` | `Pending` or `Completed` |
| `price` | Dollar amount (admin-set) |
| `request_type` | `sales` or `service` |
| `due_date`, `due_time` | Target completion |
| `start_date`, `start_time` | When work began |
| `completion_date`, `completion_time` | When marked complete |
| `date_requested` | Auto-recorded on creation |

### `account_activity`
Audit log for account-level actions.

| Column | Notes |
|---|---|
| `id` | Auto-increment |
| `action` | `create`, `delete`, or `reset` |
| `target_user_id` | ID of affected user |
| `target_user_email` | Email of affected user |
| `target_user_name` | Name of affected user |
| `performed_by` | ID of admin who performed the action |
| `created_at` | Timestamp |

---

## 11. Component Inventory

| Component | File | Purpose |
|---|---|---|
| `AuthContext` | `src/contexts/AuthContext.tsx` | Global auth state, session, login/logout, request CRUD |
| `ProtectedRoute` | `src/components/ProtectedRoute.tsx` | Blocks unauthenticated access to private routes |
| `Navbar` | `src/components/Navbar.tsx` | Site navigation; shows dashboard link for admins only |
| `Footer` | `src/components/Footer.tsx` | Public site footer with quick links |
| `PageLoader` | `src/components/PageLoader.tsx` | Animated logo loading screen on app start |
| `Dashboard` | `src/pages/Dashboard.tsx` | Main authenticated workspace |
| `RequestDetailModal` | `src/components/RequestDetailModal.tsx` | Full-screen request editor and delete UI |
| `NewRequestsNotification` | `src/components/NewRequestsNotification.tsx` | Bell badge for new pending requests (admin only) |
| `SearchFilters` | `src/components/SearchFilters.tsx` | Dashboard search input with clear button |
| `HighlightText` | `src/components/HighlightText.tsx` | Highlights matched search terms in table cells |
| `GalleryLightbox` | `src/components/GalleryLightbox.tsx` | Full-screen image viewer with keyboard navigation |
| `GoldButton` | `src/components/GoldButton.tsx` | Branded CTA button for the public site |
| `SectionHeading` | `src/components/SectionHeading.tsx` | Reusable title/subtitle block for public pages |
| `AnimatedSection` | `src/components/AnimatedSection.tsx` | Framer Motion entrance animation wrapper |
| `MobileDetailingSection` | `src/components/MobileDetailingSection.tsx` | Mobile detailing promo section on home page |
| `ScrollToTop` | `src/components/ScrollToTop.tsx` | Resets scroll position on route change |

---

## 12. Known Issues & Limitations

| Issue | Detail |
|---|---|
| `/contact` route is missing | The Contact page exists at `src/pages/Contact.tsx` but is not registered in `src/App.tsx`. Links to it across the site are broken. |
| Delete dialog says "permanent" | The request delete confirmation dialogs use the word "permanently" but requests are only soft-hidden in localStorage — not removed from the database. |
| Permissions are client-side only | There is no Row Level Security on the Supabase database. All access control is enforced in the React app. A user with direct database access can bypass all restrictions. |
| Supabase Auth unused | `getCurrentUser()` and `getUserProfile()` in `src/lib/supabase.ts` use Supabase Auth, but the app uses its own custom auth. These functions are unused. |
| `reset_token` columns unused | `users.reset_token` and `users.reset_token_expires_at` exist in the schema but are not used. Password reset uses security questions instead. |
| No `In Progress` status | If older documentation mentions an "In Progress" request status, that is not implemented. Only `Pending` and `Completed` exist. |
| Hidden requests are per-device | Since soft-deletes use localStorage, hidden requests are not synced across devices or browsers. Logging in on a new device shows all requests. |
