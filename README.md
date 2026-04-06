# TurnReady

**Unit turnover management for property managers.**

TurnReady helps small and mid-sized property management companies turn vacant units faster by replacing spreadsheets and WhatsApp with one clean, organized workspace.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui (Radix UI) |
| Backend | Supabase (Postgres + Auth + Storage) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Dates | date-fns |
| Deploy | Vercel |

---

## Features

- **Multi-tenant auth** — sign up, sign in, password reset, per-company data isolation
- **Dashboard** — live stats: active turnovers, overdue tasks, blocked units, ready units
- **Properties** — CRUD management with address, city/state, notes
- **Units** — manage units per property with bed/bath/sqft/rent and status tracking
- **Turnovers** — full lifecycle management: not started → in progress → blocked → ready
- **Tasks** — add/assign/complete tasks per turnover with priority and due dates
- **Photos** — upload inspection and progress photos to Supabase Storage
- **Activity Feed** — human-readable timeline of every action taken
- **Settings** — update profile and company info
- **Landing Page** — high-converting SaaS landing page

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd turnready
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the Supabase SQL Editor, run in order:
   - `supabase/schema.sql` — creates all tables, indexes, triggers
   - `supabase/rls.sql` — applies Row Level Security policies
   - `supabase/seed.sql` (optional) — demo data

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up Supabase Storage

In the Supabase dashboard:
1. Go to **Storage**
2. Create a new bucket called `turnover-photos` (set to **private**)
3. In the Storage Policies section, add policies (see `supabase/rls.sql` for the SQL to use)

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Supabase Auth Setup

In your Supabase project → **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (change to your production URL)
- **Redirect URLs**: Add `http://localhost:3000/api/auth/callback`

For email confirmation (sign up), the user will receive an email. In development, you can disable email confirmation in **Authentication → Providers → Email → Confirm email**.

---

## Seeding Demo Data

After your first sign-up:

1. Get your user ID from Supabase → Authentication → Users
2. Open `supabase/seed.sql`
3. Uncomment the `INSERT INTO company_members` line and replace `YOUR_USER_ID`
4. Uncomment the turnovers and tasks inserts and replace `YOUR_USER_ID`
5. Run the SQL in the Supabase SQL Editor

---

## Deploy to Vercel

1. Push your code to GitHub
2. Create a new project at [vercel.com](https://vercel.com)
3. Import the repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
5. Deploy

Update your Supabase Auth redirect URLs to include your Vercel URL.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Sign in, sign up, forgot/reset password
│   ├── (app)/            # Protected app routes
│   │   ├── dashboard/
│   │   ├── properties/
│   │   ├── units/
│   │   ├── turnovers/
│   │   └── settings/
│   ├── api/
│   │   └── auth/callback/
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn-style UI primitives
│   ├── layout/           # Sidebar, header
│   └── shared/           # Reusable app components
├── features/
│   ├── properties/
│   ├── units/
│   └── turnovers/        # Task list, photo section, status updater
├── hooks/
│   └── use-toast.ts
├── lib/
│   ├── actions/          # Server actions
│   ├── supabase/         # Client/server Supabase instances
│   ├── validations/      # Zod schemas
│   └── utils.ts          # Helpers, formatters
├── middleware.ts          # Auth protection
├── supabase/
│   ├── schema.sql
│   ├── rls.sql
│   └── seed.sql
└── types/
    └── database.ts       # Full TypeScript types
```

---

## Security

- All app data is scoped by `company_id` in Supabase RLS policies
- Server Actions validate user authentication before every mutation
- No data is ever returned without RLS enforcement at the DB level
- Storage bucket policies restrict access to the company's folder

---

## Notes

- This is an MVP. Multi-user invites, email notifications, and reporting are natural next features.
- The `settings/page.tsx` password reset currently uses a placeholder email — wire it to the actual session user email in production.
- Photo uploads require the `turnover-photos` Supabase Storage bucket to be created manually.

---

Built with Next.js 15, Supabase, Tailwind CSS, and shadcn/ui.
