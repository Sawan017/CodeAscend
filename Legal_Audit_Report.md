# Legal Consent & Privacy Audit Report

### 1. Personal Data Collected & Storage Locations
- **Authentication**: Email, password hashes (Stored in `auth.users`, `auth.identities` via Supabase).
- **Profile Data**: Username, display name, bio, avatar, background, external links (Stored in `public.profiles`).
- **Legal Consent Records**: Accepted versions of policies, timestamps (Stored in `public.user_legal_consents`).
- **Social Graph**: Friendships, blocked users, mutes (Stored in `public.friends`, `public.blocks`, `public.mutes`).
- **Chat/Messages**: Direct messaging between users is saved inside `public.profiles` under a JSONB \`chat\` key. Group chats are in \`public.group_messages\`.
- **Support Tickets**: Issue text, screenshots (Stored in `public.support_tickets`, `public.support_messages`, and Supabase \`storage.objects\`).
- **GitHub Sync**: GitHub Username, repo names, metadata (Stored in `public.github_connections`, `public.external_projects`).

### 2. Purpose of Collection
All collected data strictly operates the ARINOVA platform (e.g., identity verification, messaging, technical support, developer profiling). There are **no** third-party trackers, analytics pixels, or advertising frameworks in the application. 

### 3. Third Parties Receiving Data
- **Supabase**: Hosts the PostgreSQL database, Edge Functions, and Auth environment on AWS infrastructure.
- **Groq**: Receives support ticket context to process AI support responses (utilizing open-source LLM compatibility). **No private messages are sent to Groq.**
- **GitHub**: ARINOVA queries the GitHub API to populate developer data but does not store long-lived private access tokens beyond initial sync.

### 4. Account Deletion Mechanics
- An authenticated RPC `delete_user_account()` handles deletion. 
- **What is deleted:** `auth.users`, `public.profiles`, `auth.identities`, support tickets, external projects, and all Supabase `storage.objects` (avatars/attachments).
- **What is NOT deleted:** 1-on-1 chat messages are retained securely by the *recipient* in their respective JSONB profile object, consistent with standard telecom/messaging industry practices.

### 5. Current Policy Versions
- **Terms of Service**: v1.0
- **Privacy Policy**: v1.0

### 6. Consent Records Created
- Consent is strictly enforced via a custom PostgreSQL RPC (`reserve_username`).
- Accounts **cannot** be created unless the client successfully passes `terms_version` and `privacy_version` payload strings to the server.
- The server instantly records the user's UUID, the policy versions, and the timestamp into `public.user_legal_consents` inside the same atomic database transaction that generates the account.

### 7. Security & RLS Protections
- `public.user_legal_consents` is protected by Row Level Security (RLS). Users can only read their own consent (`user_id = auth.uid()`). No normal user can INSERT, UPDATE, or DELETE consent records.
- The RPC runs as `SECURITY DEFINER` meaning it operates securely within the server context, eliminating client-side tampering of the insertion logic.
- Children: An explicit "I confirm that I am 18 years of age or older" gate has been added to registration, adhering strictly to Indian DPDP requirements by outright restricting minor access rather than spoofing unverified parental flows.

### 8. Remaining Legal / Privacy Gaps
- **Data Export (SAR):** A "Request Export" button exists in the Settings UI, but the generated JSON payload relies on existing REST fetches. A fully compliant GDPR/DPDP export should ideally use a dedicated server-side Edge Function to comprehensively dump all linked database artifacts in a machine-readable format.
- **Support Ticket Auto-Archiving:** Closed tickets currently persist until the user manually deletes them. A 90-day auto-archive policy could minimize data footprint further.

### 9. Testing & Results
- [x] **No checkboxes** → Form prevents submission (Blocked).
- [x] **Partial checkboxes** → Form prevents submission (Blocked).
- [x] **All accepted** → Proceeded to RPC.
- [x] **Atomic Storage** → `user_legal_consents` row generated immediately upon `reserve_username` transaction commit.
- [x] **In-App Modal** → Clicking "Privacy Policy" or "Terms of Service" opens the newly verified text dynamically without exiting the signup flow.
- [x] **Account Deletion** → Successfully cascades via PostgreSQL constraint behavior, including the newly patched `storage.objects` purge logic.
