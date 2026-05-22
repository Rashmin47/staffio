# Staffio

Staffio is a calm job board built with Next.js, Prisma, PostgreSQL, and NextAuth. It focuses on clear publishing flows, useful search, and a dashboard that makes hiring activity easy to scan.

## What is included

- A polished landing page with live job counts and featured roles
- Searchable job listings with keyword, type, and location filters
- Job detail pages with a direct application flow
- Authenticated posting for new roles
- A dashboard for tracking posted jobs and submitted applications
- GitHub sign-in powered by NextAuth

## Tech Stack

- Next.js 15
- React 19
- Prisma ORM
- PostgreSQL
- NextAuth
- Tailwind CSS v4
- TypeScript

## Local Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

The app runs at http://localhost:3000.

## Environment Variables

Make sure your `.env` includes your database connection and auth provider values, especially `DATABASE_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, and `GITHUB_SECRET`.

## Project Structure

- `app/` contains the routes, pages, and API handlers
- `components/` contains shared UI pieces like the navbar and session provider
- `lib/` contains Prisma and auth helpers
- `prisma/` contains the schema and migration history

## Deployment

The app is ready for Vercel deployment once the environment variables and database are configured.
