# Deploying FameTerra Agency OS (Vercel + Neon)

This gets you a live, public URL on free tiers. Total time: about 5 minutes.

## 1. Create the database (Neon)

1. Go to [neon.tech](https://neon.tech) and sign up (free).
2. Create a new project (any name/region).
3. On the project dashboard, open **Connection Details**, select **Pooled connection**,
   and copy the connection string. It looks like:

   ```
   postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require
   ```

   Make sure it's the **pooled** one (hostname contains `-pooler`) — this is required for
   serverless deployments like Vercel, which open many short-lived database connections.

## 2. Push this repo to your own GitHub account

If this code isn't already in a repo you can connect to Vercel, push it there first
(Vercel deploys by importing a GitHub repository).

## 3. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign up/log in (free).
2. Click **Import** next to this GitHub repository. Framework preset will auto-detect
   **Next.js** — leave the build settings as default (the repo's `package.json` already
   runs `prisma generate` on install and `prisma migrate deploy` before `next build`).
3. Before clicking **Deploy**, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | the Neon **pooled** connection string from step 1 |
   | `AUTH_SECRET` | a random secret — generate one with `openssl rand -base64 32` |

   (Leave `NEXTAUTH_URL` unset — Vercel deployments auto-detect the host.)

4. Click **Deploy**. Vercel will install dependencies, generate the Prisma client, run
   your migrations against Neon, and build the app. First deploy typically takes 1–2
   minutes.

## 4. Create your Super Admin

Once deployed, visit your new `https://your-app.vercel.app` URL. Since the database is
empty, you'll land on the **first-run setup screen** — create your own Super Admin
account there (name, email, password). After that, public setup is disabled and all
further accounts are created from **Team → Add Employee** inside the app.

Do **not** run `npm run db:seed` against this database unless you specifically want the
bundled demo data (sample employees/clients/tasks) — it's meant for local development,
not a real deployment.

## 5. (Optional) Custom domain

In the Vercel project → **Settings → Domains**, add your own domain (e.g.
`os.fameterra.com`) and follow the DNS instructions Vercel shows you.

## Updating the app later

Every `git push` to your connected branch triggers a new Vercel deployment automatically,
running any new Prisma migrations against the same Neon database before the build
completes.

## Troubleshooting

- **Build fails on `prisma migrate deploy`**: double check `DATABASE_URL` is the Neon
  *pooled* string and is set for the Production environment in Vercel's project settings.
- **Login redirects loop or fails**: confirm `AUTH_SECRET` is set. Without it, sessions
  can't be signed.
- **"Too many connections" errors under load**: confirm you're using Neon's pooled
  connection string, not the direct one.
