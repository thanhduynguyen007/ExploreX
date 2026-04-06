# Repository Guidelines

## Project Structure & Module Organization
This repository is centered on [`explorex-travel/`](C:\Users\DevLe\Desktop\Du_An\02_NodeJS\DoAnCoThuy\explorex-travel), a Next.js 16 + TypeScript app. Main source lives in `explorex-travel/src/`: `app/` for App Router pages and API routes, `components/` for UI, `services/` for business logic, `lib/` for auth, DB, env, and validation helpers, and `types/` for shared types. Use `explorex-travel/public/` for static assets and `explorex-travel/scripts/` for database normalization, seeding, and test runners. Top-level `docs/`, `images-mau/`, and `back-end/` are reference material, not the primary runtime.

## Build, Test, and Development Commands
Run all app commands from `explorex-travel/`.

- `npm install`: install dependencies.
- `npm run dev`: start the local app at `http://localhost:3000`.
- `npm run build`: produce the production build.
- `npm run start`: serve the built app.
- `npm run lint`: run ESLint with the Next.js core-web-vitals and TypeScript config.
- `npm test`: run the custom Node-based assertions in `scripts/run-tests.cjs`.
- `npm run db:normalize-tour` / `npm run db:seed-tours`: update or seed MySQL data; matching scripts exist for auth, schedules, bookings, reviews, and statuses.

## Coding Style & Naming Conventions
Use TypeScript with strict mode enabled. Follow the existing style: 2-space indentation, semicolons, double quotes, and the `@/*` import alias for `src/*`. Keep React components and pages in `PascalCase`-friendly file groupings, but use lowercase route folders in `src/app/`. Service, validation, and utility modules use kebab-case filenames such as `booking.service.ts` and `tour-group.ts`.

## Testing Guidelines
Current tests are lightweight integration/unit checks inside `scripts/run-tests.cjs`, built with `node:assert/strict` and loaded through `jiti`. Add new cases near the related domain block and give each test a behavior-focused name. Run `npm test` before opening a PR; run `npm run lint` as well for UI or route changes.

## Commit & Pull Request Guidelines
Recent commits are short and informal (`first commit`, `lan 2`, `đắp admin xịn hơn, vá luôn flow danh mục`). Keep new commit messages concise, imperative, and scoped to one change, for example: `add provider booking status guard`. PRs should include a short summary, affected areas, setup or migration notes, linked issues, and screenshots for visible UI changes.

## Security & Configuration Tips
Environment defaults are defined in `src/lib/env.ts`, including `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`. Do not rely on the development JWT secret outside local work, and avoid committing real credentials or seeded production data.

## Database Change Rules
Treat `docs/crebas5_fixed.sql` and the project docs under `docs/` as the source of truth for schema and field names. Do not invent new database columns, tables, timestamps, status fields, or role fields unless the user explicitly approves the change and the corresponding docs are updated first. When code and docs disagree, align code back to the documented schema or stop and ask before changing the database model.
