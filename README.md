# FameTerra Agency OS

Internal agency management and operations platform for **FameTerra Digital Agency**.

A single, database-driven web application for managing employees, departments, attendance,
tasks, clients, content delivery, campaigns, workload, performance, reports, notifications
and activity history — built so the agency can operate it entirely from the browser, with
no source code changes required for day-to-day use.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **PostgreSQL** + **Prisma ORM**
- **NextAuth v5** (credentials provider, JWT sessions) for authentication
- **Tailwind CSS v4** with a hand-built, premium dark/neutral component kit
- Server Actions + API routes for all mutations, with permission checks enforced server-side
- **Zod** for input validation, **bcryptjs** for password hashing

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a PostgreSQL database and set `DATABASE_URL` in `.env` (copy `.env.example`):

   ```bash
   cp .env.example .env
   ```

3. Run migrations:

   ```bash
   npx prisma migrate deploy   # or `npx prisma migrate dev` in development
   ```

4. (Optional but recommended for trying the app) Seed sample roles, departments, employees,
   clients and tasks:

   ```bash
   npm run db:seed
   ```

   This creates a ready-to-use Super Admin account:

   - `admin@fameterra.com` / `Password123!`

   Along with sample accounts for Head of Operations, Manager, Team Lead, Employee and
   Intern roles (see `prisma/seed.ts` for the full list). **Do not run the seed script
   against a production database that already has real data** — it is meant for local
   development and demos.

   If you skip seeding, visiting the app for the first time will show the **first-run
   setup screen**, where you create the initial Super Admin account yourself. Public
   setup is disabled permanently once that account exists.

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000).

## How the system is organized

Nothing in this app is hardcoded. Employees, departments, roles, clients, tasks, content,
campaigns, leave types, holidays and the working schedule are all rows in the database,
manageable entirely from **Settings** and the relevant module pages by users with the
right permissions.

- **Auth & setup** — `src/lib/auth.ts`, `src/lib/auth-guard.ts`, `src/app/(auth)/setup`,
  `src/app/(auth)/login`. First-run flow creates the Super Admin and seeds the six default
  roles/eight default departments; after that, only admins can create accounts.
- **Permissions** — `src/lib/permissions.ts` defines the full permission catalogue and the
  default permission sets for the six built-in roles (Super Admin, Head of Operations,
  Manager, Team Lead, Employee, Intern). Permissions are stored per-role in the database
  (`Role.permissions`, a JSON array) and editable from **Settings → Roles & Permissions**.
  Every server action and page checks permissions server-side via `requirePagePermission` /
  `requireActionPermission` — the UI hides what a user can't do, but the server is the real
  gate.
- **Modules** — under `src/app/(app)/`: `dashboard`, `attendance`, `tasks` (+ `tasks/board`
  for department/agency-wide views), `clients` (with a tabbed client profile), `content`,
  `campaigns`, `team`, `performance`, `reports`, `notifications`, `activity`, `settings`.
- **Server actions** — under `src/lib/actions/`, one file per module. Every mutation writes
  to `ActivityLog` (audit trail) and, where relevant, creates `Notification` rows.
- **Database schema** — `prisma/schema.prisma`. Historical records are preserved: employees
  are deactivated/suspended (never deleted), clients are archived (never deleted), and their
  past tasks, attendance and activity remain intact and attributed to them.

## Working schedule

FameTerra's official schedule (working days, daily start time, meeting time, final
accountability time, end of day, and the attendance grace period) is configurable at
**Settings → General** and used live by the attendance check-in/late calculation and the
monthly attendance-percentage calculation — nothing is hardcoded.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm start` — production build and start
- `npm run lint` — ESLint
- `npm run db:seed` — run the seed script
- `npm run db:migrate` — `prisma migrate dev`
- `npm run db:studio` — open Prisma Studio

## Security notes for production

- Set a strong, unique `NEXTAUTH_SECRET` and a real `DATABASE_URL`/`NEXTAUTH_URL`.
- Passwords are hashed with bcrypt; new employees get a temporary password that must be
  changed on first login (`Employee.mustChangePassword`).
- All permission checks happen server-side in Server Actions and page loaders — never rely
  on the sidebar/UI hiding a button as the only protection.
