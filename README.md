# ARINOVA

## 1. ARINOVA OVERVIEW

ARINOVA is a premium, futuristic developer career RPG that transforms real-world learning, projects, goals, and achievements into an interactive progression experience. 

Designed for developers who want to gamify their professional growth, ARINOVA combines a robust learning and project tracker with a rich social platform. It aims to solve developer burnout and motivation loss by introducing RPG mechanics—such as skill trees, XP, leveling, and cinematic environments—into daily coding habits, turning the software engineering journey into a compelling and rewarding adventure.

---

## 2. CORE FEATURES

ARINOVA implements a comprehensive suite of progression and UI features:
- **Cinematic Landing Experience**: Uses `three.js` and React Three Fiber to render an interactive, floating 3D environment.
- **Career/World Progression**: Visual node-based roadmap/world map for career stages.
- **Progression HUD**: Tracks global XP, Levels, Badges, and Streaks (complete with a flame counter and inactivity logic).
- **Profiles**: Extensive developer profiles displaying stats, top projects, skills, and current level.
- **Projects**: Capability to add personal projects and mark them complete for XP.
- **Skills**: Log active practice sessions and master specific technologies for progression bonuses.
- **Goals (Quests)**: Set deadlines, configure difficulty levels, track overdue tasks, and earn early-completion XP bonuses.
- **Achievements & Badges**: Unlockable milestone rewards with integrated toast notifications.
- **Advanced UI & Theming**: Integrated Monaco code editor, smooth scrolling via Lenis, animated toasts, and dynamic themes (Dark, Light, System, Midnight, Aurora).
- **Accessibility**: Built-in reduced-motion options and animation-intensity controls.
- **Demo/Local Persistence**: Support for local browser storage (`localStorage`) as a fallback or for unauthenticated demo previewing.

---

## 3. SOCIAL FEATURES

ARINOVA includes a fully integrated, real-time social networking layer:
- **Developer Discovery**: Search for other developers by exact username or ID.
- **Friend System**: Send, receive, reject, and manage friend requests.
- **One-to-One Messaging**: Secure, direct messaging with other users.
- **Group Chats**: Multi-member group chat environments with admin/member roles.
- **Chat Controls**: Users can **edit** messages, **unsend** (delete for everyone), or **delete for me** (hide from their own view).
- **Blocking/Muting**: Capabilities to mute specific chat notifications or block unwanted users.
- **Presence Tracking**: Real-time online/offline status indicators via Supabase Realtime.

---

## 4. AUTHENTICATION & ACCOUNT SYSTEM

ARINOVA utilizes a secure authentication architecture powered by Supabase Auth:
- **Primary Auth**: JWT-based authentication resolving to `auth.uid()`.
- **Providers**: Supports standard Email/Password login as well as Google and GitHub OAuth.
- **Account Identity Bridging**: Safely transitions reserved usernames or anonymous placeholder identities into fully authenticated users via database triggers upon signup.
- **Authentication Security**: Integrates Cloudflare Turnstile to prevent automated bot signups. Includes custom rate-limiting for failed password attempts (`auth_login_attempts` table).

---

## 5. GITHUB INTEGRATION

The platform integrates directly with GitHub to pull real-world developer data into the RPG ecosystem:
- **OAuth Integration**: Users can link their GitHub accounts for seamless authentication.
- **Repository Syncing**: The `src/lib/github.ts` service fetches the user's connected public repositories.
- **Language Tracking**: Tracks repository languages, allowing users to reflect their real-world GitHub coding activity within ARINOVA's skill progression system.

---

## 6. DATABASE / BACKEND

The backend is entirely hosted on **Supabase (PostgreSQL)**, utilizing a thick-database architecture.

**Key Tables/Entities**:
- `profiles`, `settings`, `user_identities`, `user_legal_consents`
- `progression`, `goals`, `projects`, `external_projects`, `skills`, `achievements`, `badges`
- `friendships`, `friend_requests`
- `chat_groups`, `chat_group_members`, `chat_group_messages`, `notifications`
- `support_tickets`, `support_messages`, `support_admins`, `rate_limits`

**Architecture**:
- **Row Level Security (RLS)**: Enforced universally. Users can only access rows where their authenticated UUID (`auth.uid()`) matches the record's owner ID.
- **Foreign-Key Cascading**: Extensive use of `ON DELETE CASCADE`. Deleting a user in `auth.users` automatically ripples through all relational tables to ensure complete data erasure.
- **RPC Functions**: Custom Postgres Remote Procedure Calls are used to handle complex atomic operations (e.g., safely exporting user data, evaluating profile privacy).

---

## 7. PRIVACY & DATA PROTECTION

ARINOVA implements technical mechanisms designed to support robust data rights and user privacy:
- **Personal-Data Export**: Authenticated users can request a complete, structured JSON export of their personal data from the settings panel.
- **Account & Data Deletion**: Users can permanently delete their accounts. This triggers a cascading deletion across the database (retaining only the recipient's copy of sent 1-on-1 messages, in alignment with standard communication retention).
- **Data Correction**: Users have full editing rights over their profiles and progression data.
- **Legal Consent Handling**: Terms of Service and Privacy Policy versions are captured at signup and stored in `user_legal_consents`.
- **Privacy/Profile Visibility**: Granular public/private profile controls. A private profile blocks non-friends from viewing stats while allowing accepted friends to bypass the lock.
- **Compliance Context**: ARINOVA implements the technical workflows (data export, explicit consent, right to erasure) that align with the principles of data protection frameworks like India's DPDP Act. *Note: This represents technical implementation only and does not constitute official legal certification.*

---

## 8. SECURITY

Security is enforced at the database and application layer:
- **Contextual Authorization**: Backend queries strictly utilize the JWT context (`auth.uid()`).
- **IDOR Protection**: Insecure Direct Object Reference is prevented via RLS; malicious API calls cannot fetch or mutate another user's data.
- **Account Deletion Protections**: Protected by RPC design so a user cannot spoof a deletion request for another UID.
- **Privacy Visibility Rules**: Evaluated at the database level (`is_profile_public` RPC) to prevent sensitive profile payloads from ever reaching unauthorized clients.
- **Bot Mitigation**: Cloudflare Turnstile CAPTCHA intercepts and validates human interaction during unauthenticated flows.

---

## 9. THIRD-PARTY SERVICES

- **Supabase**: Provides PostgreSQL database hosting, Authentication, Realtime websocket subscriptions (for chat/presence), and Object Storage (for support ticket attachments).
- **GitHub**: Provides OAuth identity and repository/language fetching.
- **Cloudflare Turnstile**: Provides privacy-respecting CAPTCHA validation.
- **Groq**: AI API provider utilized internally to power the automated tier-1 support system (assisting with user support tickets).

---

## 10. TECH STACK

**Frontend & Core:**
- React (v19)
- TypeScript
- Vite
- React Router (Integrated custom routing)

**UI & Styling:**
- Standard CSS / CSS Custom Properties (Note: Tailwind is *not* used)
- Framer Motion (Animations)
- Lucide React (Icons)
- Lenis (Smooth scrolling)
- Monaco Editor (`@monaco-editor/react`)

**3D Graphics:**
- Three.js
- React Three Fiber (`@react-three/fiber`)
- Drei (`@react-three/drei`)

**Backend integration:**
- `@supabase/supabase-js`

**Security:**
- `@marsidev/react-turnstile`

---

## 11. PROJECT STRUCTURE

```text
├── public/                 # Static assets (images, SVGs, CinematicWorld textures)
├── src/
│   ├── components/         # Shared UI (HUD, TopBar, ErrorBoundary, CareerWorld)
│   ├── data/               # Static journey configurations and learning pathways
│   ├── features/           # Domain-driven feature modules (auth, chat, settings, support)
│   ├── hooks/              # Custom React hooks (usePersist, useToasts)
│   ├── lib/                # Third-party SDK wrappers (supabase.ts, github.ts, api.ts)
│   ├── types/              # Global TypeScript interfaces
│   ├── utils/              # Helper utilities (storage, dates)
│   ├── App.tsx             # Root application shell and routing logic
│   └── main.tsx            # React entry point
├── supabase/
│   └── migrations/         # Raw SQL migrations (Schema, RLS, RPCs, Triggers)
├── .env.example            # Environment variable template
├── package.json            # Scripts and dependencies
└── vite.config.ts          # Vite configuration
```

---

## 12. LOCAL DEVELOPMENT SETUP

### Prerequisites
- Node.js (v18+)
- npm
- A Supabase account

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd random
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Provide the required variable names inside `.env.local`:
- `VITE_SUPABASE_URL`: (Required) The URL of your Supabase project instance.
- `VITE_SUPABASE_ANON_KEY`: (Required) The public anonymous key for Supabase Auth/API.
- `VITE_TURNSTILE_SITE_KEY`: (Required) The public site key for Cloudflare Turnstile CAPTCHA.

### Running the App
To start the development server:
```bash
npm run dev
```

---

## 13. SUPABASE / DATABASE SETUP

To configure the backend for ARINOVA:
1. Open your Supabase Dashboard and navigate to the **SQL Editor**.
2. Apply the migration scripts found in `supabase/migrations/` sequentially. These files will:
   - Create all requisite tables (`profiles`, `friendships`, `chat_groups`, `support_tickets`, etc.).
   - Configure Foreign Key relationships and cascading rules.
   - Establish and enable Row Level Security (RLS) policies.
   - Define custom RPCs and identity-linking triggers.
3. In **Authentication -> Providers**, enable **Email**, **Google**, and **GitHub**.
4. In **Storage**, create necessary buckets (such as `support_attachments` if required by the support system).

---

## 14. BUILD & DEPLOYMENT

ARINOVA is a standard Vite Single Page Application (SPA). 

To create an optimized production build:
```bash
npm run build
```
*(This runs `tsc -b && vite build` as defined in package.json).*

To preview the generated `dist/` build locally:
```bash
npm run preview
```

The `dist/` directory can be deployed to static hosting platforms (Vercel, Netlify, Cloudflare Pages). Ensure the hosting platform is configured with the same `VITE_*` environment variables, and remember to add your production URL to the Supabase OAuth Redirect URIs.

---

## 15. PRIVACY / LEGAL DOCUMENTATION

The application contains integrated UI functionality for legal documentation. A `<LegalModal>` component actively presents the Terms of Service and Privacy Policy to the user. This ensures users are explicitly informed of data practices natively within the app, fulfilling the consent tracking requirements recorded during the signup process.

---

## 16. CURRENT PROJECT STATUS

ARINOVA is under active development. The core RPG progression mechanics, robust social chat architectures, and security-first backend integrations are fully implemented and functional.
