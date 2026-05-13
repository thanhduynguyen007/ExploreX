# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ExploreX Travel is a Vietnamese travel booking platform with three user roles:
- **CUSTOMER**: Browse tours, book, write reviews
- **PROVIDER**: Manage own tours, schedules, view bookings
- **ADMIN**: Full system access, manage users, providers, content

## Tech Stack

- **Framework**: Next.js 16.2.2 with React 19.2.4 (App Router)
- **Styling**: Tailwind CSS 4 with `@tailwindcss/postcss`
- **Database**: MySQL via `mysql2` (schema source: `docs/crebas5_fixed.sql`)
- **Auth**: JWT with `jose`, stored in HTTP-only cookies (`AUTH_COOKIE_NAME`)
- **Payments**: VNPay integration with demo fallback (no real credentials needed)
- **Forms**: `yup` validation schemas in `src/lib/validations/`
- **Charts**: `recharts` for admin dashboard
- **Toasts**: `sonner` for notifications

## Commands

```bash
cd explorex-travel

# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint check

# Database (requires running DB or uses mock auth fallback)
npm run db:seed-tours         # Seed demo tours
npm run db:seed-schedules     # Seed demo schedules
npm run db:seed-bookings      # Seed demo bookings
npm run db:seed-reviews       # Seed demo reviews
npm run db:seed-tour-groups   # Seed demo tour groups
npm run db:seed-auth          # Seed demo auth accounts

# Schema normalization (run after DB changes)
npm run db:normalize-tour
npm run db:normalize-schedule
npm run db:normalize-booking
npm run db:normalize-review
npm run db:normalize-auth
```

## App Structure

### Route Groups

| Group | Prefix | Purpose |
|-------|--------|---------|
| `(public)` | `/` | Landing, login, register, tour browsing |
| `(account)` | `/account` | Customer dashboard (CUSTOMER only) |
| `(admin)` | `/admin` | Superadmin panel |
| `(admin)` | `/admin/provider` | Provider panel (PROVIDER + ADMIN) |

### API Routes

API routes mirror page structure under `/api`:
- `/api/admin/*` — Admin-only endpoints
- `/api/admin/provider/*` — Provider endpoints
- `/api/auth/*` — Login, logout, register
- `/api/me/*` — Current user endpoints (customer bookings, profile, reviews)
- `/api/bookings` — Public booking creation
- `/api/tours` — Public tour listing
- `/api/reviews` — Public reviews

### Key Directories

```
src/
├── app/
│   ├── (public)/          # Public pages, auth
│   ├── (account)/         # Customer pages (CUSTOMER role)
│   ├── (admin)/           # Admin/provider pages
│   │   ├── admin/          # Superadmin panel (ADMIN role)
│   │   └── admin/provider/ # Provider panel (PROVIDER + ADMIN)
│   └── api/               # API routes (mirrors page structure)
├── components/
│   ├── forms/             # Form components (yup-validated)
│   ├── admin/             # Filter bars, row-actions, approval-actions
│   ├── account/           # Customer components
│   ├── provider/          # Provider row-actions, tour/schedule actions
│   ├── public/            # Tour browser, detail view
│   ├── layout/            # Header, sidebar, footer
│   └── ui/                # Badges, cards, page-hero
├── services/              # Business logic layer (all SQL queries here)
│   ├── auth.service.ts    # Login, register, session
│   ├── booking.service.ts # Booking CRUD, VNPay
│   ├── dashboard.service.ts # Admin dashboard stats
│   ├── provider.service.ts # Provider management, approval flow
│   ├── report.service.ts  # Reports, PPTX export
│   ├── review.service.ts  # Review CRUD, eligibility
│   ├── schedule.service.ts # Tour schedules
│   ├── tour.service.ts    # Tour CRUD
│   ├── tour-group.service.ts # Tour groups
│   └── user.service.ts    # User management
├── types/                 # TypeScript interfaces for domain entities
│   ├── auth.ts, booking.ts, tour.ts, schedule.ts, review.ts,
│   ├── provider.ts, tour-group.ts, user.ts, admin-account.ts
├── lib/
│   ├── auth/             # JWT, session, guards, role checks
│   ├── db/               # MySQL connection pool
│   ├── payments/         # VNPay integration
│   ├── validations/      # yup schemas per domain
│   └── constants/        # Status enums, auth constants
└── components/providers/  # Toast provider (sonner)
```

### Data Flow

Pages call API routes → API routes call services → services query MySQL → services return typed data → pages render. API routes handle auth checks; services handle business logic; components handle presentation.

## Auth Architecture

- JWT token stored in HTTP-only cookie (`AUTH_COOKIE_NAME`)
- Session parsed server-side via `getSessionUser()` or `getRequiredApiUser()`
- Guards: `requireApiRole()`, `requireOwnership()`
- `AUTH_USE_MOCK=true` enables demo accounts when DB is unavailable
- Demo accounts: admin@explorex.vn / provider@explorex.vn / customer@explorex.vn (password: demo)

## Permissions

- `src/lib/permissions.ts`: Role-based path access
- `src/lib/auth/guards.ts`: `ApiRequestError`, `ApiAuthError`, `toApiErrorResponse()`
- MySQL errors mapped to user-friendly messages (duplicate entry, foreign key, etc.)

## Environment Variables

See `.env.example`. Key variables:
- `JWT_SECRET` — Change in production
- `AUTH_USE_MOCK` — Set to `true` for demo mode without DB
- `DB_*` — MySQL connection (crebas5 by default)
- `VNPAY_*` — Leave empty to use demo payment fallback

## Known Gaps (do not extend without approval)

- `account/profile` — not yet implemented against `nguoidung + khachhang` schema
- Customer review history page — not yet built
- Public booking flow on tour detail page — submit flow incomplete (placeholder)
- Cart concept exists in UI only; no cart table in schema

## Schema Source

When code and DB local dump diverge, prioritize `docs/crebas5_fixed.sql`. Related docs:
- `docs/ai_build_spec.md` — business specification
- `docs/database_normalization.md` — DB normalization notes
- `docs/explorexver2.sql` — synchronized schema dump

## Image Handling

- Upload endpoint: `/api/admin/uploads/tour-images`
- `src/lib/images.ts` handles image utilities
- Uploaded images stored in `public/uploads/`