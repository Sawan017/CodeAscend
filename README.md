# ARINOVA

ARINOVA is a premium, futuristic developer career RPG that transforms real-world learning, projects, goals, and achievements into an interactive progression experience. 

Designed for developers who want to gamify their professional growth, ARINOVA combines a robust learning tracker with a rich social platform, complete with achievements, skill trees, group chats, and cinematic environments. It solves the problem of developer burnout and motivation loss by turning daily coding habits into a compelling, rewarding journey.

---

## 🎮 Core Features

- **Immersive Interface**: A cinematic 3D landing experience built with `three.js` and React Three Fiber. Features an advanced UI with animated toasts, notifications, and dynamic themes (Dark, Light, System, Midnight, Aurora). Accessibility is respected via reduced-motion settings.
- **Gamified Progression**: Track XP, Levels, Badges, Achievements, and Daily Streaks via a central HUD and flame counter.
- **Career & Learning Tracker**: 
  - **Goals (Quests)**: Set deadlines, manage difficulty, earn early-completion XP bonuses, and track overdue tasks.
  - **Projects**: Manage personal projects, link them to real-world repositories, and mark them complete for XP.
  - **Skills**: Log active practice sessions and master technologies to unlock progression bonuses.
  - **Career World Map**: A visually interactive node-based progression map.

## 💬 Social Features

ARINOVA includes a fully integrated social networking layer:
- **Friend System**: Send, receive, and manage friend requests.
- **Developer Discovery**: Search for other developers by username or ID.
- **Messaging & Group Chats**: Real-time 1-on-1 direct messaging and multi-member group chats (with member roles). 
- **Chat Controls**: Users can edit/unsend their own messages, and mute or block other users to prevent unwanted interaction.
- **Online Presence**: Real-time online status and presence tracking across the platform.
- **Privacy Controls**: Granular profile visibility settings (Public/Private), allowing friends to bypass privacy locks while protecting data from strangers.

## 🔐 Authentication & Account System

- **Architecture**: Powered by Supabase Auth (JWT).
- **Methods**: Supports secure Email/Password login, alongside Google and GitHub OAuth integrations.
- **Security Mechanics**: Includes Turnstile CAPTCHA to protect signup/login endpoints from automated abuse. Account creation safely bridges placeholder identities into full authenticated users.

## 🐙 GitHub Integration

- **OAuth Login**: Seamless 1-click login and identity linking via GitHub.
- **Repository Syncing**: Connects to the user's GitHub account to pull in repositories and language statistics, integrating external developer activity directly into ARINOVA's progression and project tracking systems.

## 🗄️ Database / Backend

The backend is built entirely on **Supabase (PostgreSQL)**.
- **Core Entities**: `profiles`, `settings`, `progression`, `goals`, `projects`, `skills`, `achievements`, `badges`, `friendships`, `friend_requests`, `chat_group_messages`, `support_tickets`, `user_legal_consents`.
- **Row Level Security (RLS)**: Every user table enforces strict RLS policies, ensuring users can only `SELECT`, `INSERT`, `UPDATE`, or `DELETE` rows where `auth.uid() = user_id`.
- **Cascading Deletions**: Heavy reliance on Postgres `ON DELETE CASCADE` ensures that deleting a user account cleanly wipes all associated rows across the database without orphaned data.
- **Custom RPCs**: Utilizes secure Postgres Remote Procedure Calls (e.g., `export_user_data`, `delete_user_account`) that internally resolve the target user via JWT context, preventing manipulation.

## 🛡️ Privacy & Data Protection

ARINOVA features built-in, robust data protection mechanics:
- **Personal Data Export**: Authenticated users can generate a comprehensive JSON export of all their data via the Settings panel.
- **Account Erasure**: A verified account deletion flow that permanently removes the user's authentication identity and cascades through all personal data (preserving only the recipient's copy of sent 1-on-1 messages, as per standard retention policies).
- **Consent Tracking**: Explicit Terms of Service and Privacy Policy consent versions are captured during signup and securely stored in `user_legal_consents`.
- **Profile Privacy**: Backend RPCs (`is_profile_public`) evaluate the target's visibility settings and friendship status before returning profile payloads, preventing client-side data leaks.

## 🔒 Security

- **IDOR Protection**: All data mutations strictly validate the JWT payload (`auth.uid()`).
- **Bot Protection**: Cloudflare Turnstile validates human interaction during unauthenticated flows.
- **Secure Architecture**: Secrets and private keys are strictly kept on the server/Supabase edge. The client only possesses the anonymous public key.

## 🔌 Third-Party Services

- **Supabase**: Primary database, authentication, realtime subscriptions, and object storage.
- **GitHub**: Used for developer profile syncing and OAuth.
- **Cloudflare Turnstile**: Used for privacy-respecting CAPTCHA and bot mitigation.
- **Groq (AI)**: Powers the automated tier-1 support system, processing non-sensitive support tickets with fast LLM inference.

## 💻 Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Standard CSS Modules / Custom Properties (No Tailwind)
- **Animation**: Framer Motion
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Icons**: `lucide-react`
- **Backend SDK**: `@supabase/supabase-js`
- **Security**: `@marsidev/react-turnstile`

## 📁 Project Structure

```text
├── public/                 # Static assets (images, icons)
├── src/
│   ├── components/         # Reusable UI components (HUD, TopBar, ErrorBoundary)
│   ├── data/               # Static configuration and learning pathway data
│   ├── features/           # Domain-specific modules (auth, chat, projects, settings)
│   ├── hooks/              # Custom React hooks (usePersist, useToasts)
│   ├── lib/                # Third-party initializations (supabase, github, api)
│   ├── types/              # Global TypeScript interfaces
│   ├── utils/              # Helper functions (storage, date formatting)
│   ├── App.tsx             # Main application shell and routing
│   └── main.tsx            # React entry point
├── supabase/
│   └── migrations/         # PostgreSQL schema, RLS, and RPC definitions
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite build configuration
```

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- A Supabase account

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd random
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in the required variables in `.env.local`:
- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase public anonymous key.
- `VITE_TURNSTILE_SITE_KEY`: Your Cloudflare Turnstile public site key.

*(Note: Never commit your `.env.local` file or place private service-role keys in it).*

### 4. Running the Development Server
```bash
npm run dev
```

## 🗄️ Supabase / Database Setup

To configure the backend for ARINOVA:
1. Navigate to the SQL Editor in your Supabase Dashboard.
2. Apply the migration files located in `supabase/migrations/` sequentially. These scripts will:
   - Create all required tables (`profiles`, `settings`, `chat_group_messages`, etc.).
   - Establish Foreign Key relationships with `ON DELETE CASCADE`.
   - Enable and configure Row Level Security (RLS) for every table.
   - Create the necessary Postgres RPCs (`export_user_data`, `delete_user_account`, etc.).
3. Go to **Authentication -> Providers** and enable **Email**, **Google**, and **GitHub**.
4. Go to **Storage** and create the `support_attachments` bucket.

## 🏗️ Build & Deployment

ARINOVA is a standard Vite Single Page Application (SPA).

To create a production build:
```bash
npm run build
```
This generates optimized static assets in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

The `dist/` folder can be deployed to any static hosting provider (e.g., Vercel, Netlify, Cloudflare Pages). Ensure that your hosting provider is configured with the same environment variables and that your deployment URL is added to your Supabase Auth Redirect URIs.

## ⚖️ Legal Documentation

ARINOVA includes native interfaces for users to review legal documentation. The Terms of Service and Privacy Policy are embedded directly into the application (accessible via the `SettingsDrawer` -> `<LegalModal>`), ensuring users are always informed about data collection, retention, and third-party processing.

## 📈 Current Project Status

ARINOVA is in **active development**. Core RPG mechanics, social features, and privacy-compliant data systems are fully implemented and functional.
