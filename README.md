# FutureMe

FutureMe is a premium futuristic developer career RPG that turns real learning, projects, goals, and achievements into an interactive progression experience.

## Features
- Cinematic landing experience
- Career world map with interactive nodes
- Progression HUD with XP, levels, badges, and streaks
- Profile, projects, skills, goals, achievements, and future roadmap
- **Goals**: difficulty levels, deadlines, early-completion XP bonus, overdue detection, add/remove quests
- **Projects**: mark complete for XP
- **Skills**: log practice (+10%) and mark mastered for XP
- **Achievements + Badges**: unlockable with XP rewards
- **Streaks**: daily activity tracking with a flame counter
- **Advanced UI**: level-up toasts, XP gain toasts, unlock notifications
- **Dark/light/system/midnight/aurora themes** with reduced-motion and animation-intensity settings
- **Demo mode** with local persistence (localStorage)
- **Optional Supabase integration** for Google login and cross-device persistence

## Tech stack
- React
- TypeScript
- Vite
- Framer Motion
- Lucide React
- Supabase (optional, for auth + persistence)

## Local setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Create an environment file
   ```bash
   cp .env.example .env
   ```
3. Start the app
   ```bash
   npm run dev
   ```

## Demo mode
The app works without Supabase by using local demo data and localStorage. Leave `VITE_DEMO_MODE=true` (or omit the Supabase env vars) to run in demo mode.

## Supabase setup (Google login + persistence)

### 1. Create a Supabase project
- Go to https://supabase.com and create a new project.

### 2. Run the database migration
- Open the Supabase Dashboard → SQL Editor.
- Paste the contents of `supabase/migrations/0001_init.sql` and run it.
- This creates the `profiles`, `progression`, `goals`, `projects`, `skills`, `achievements`, `badges`, and `settings` tables, **enables Row Level Security (RLS)** on all of them, and adds the per-user policies.

### 3. Enable Google OAuth
- In the Supabase Dashboard go to **Authentication → Providers**.
- Enable the **Google** provider.
- You'll need to create an OAuth Client in the [Google Cloud Console](https://console.cloud.google.com/):
  1. Create a project (or use an existing one).
  2. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
  3. Application type: **Web application**.
  4. Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
  5. Copy the **Client ID** and **Client Secret** into the Supabase Google provider settings.
  6. You may also need to configure the **Authorized JS origins** and add your localhost URL (`http://localhost:5173`) for local testing.

### 4. Add your environment variables
Create a `.env` file (copy from `.env.example`) and fill in:
```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_DEMO_MODE=false
```
- The anon key is found in the Dashboard under **Settings → API**.
- Set `VITE_DEMO_MODE=false` to unlock Google login and remote syncing.

### How it works
- When logged in, all profile, progression, goals, projects, skills, achievements, badges, and settings are upserted to Supabase keyed by your user ID.
- On login, your remote data is loaded and replaces local demo data.
- RLS ensures each user can only read/write their own rows.

## Deployment
The app is a standard Vite + React build. Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.).
- Set the same environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_DEMO_MODE=false`) in the host's environment settings.
- Add your production URL to the Supabase Google OAuth **Authorized redirect URIs** (e.g. `https://yourdomain.com/auth/v1/callback`).

## Environment variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_DEMO_MODE`