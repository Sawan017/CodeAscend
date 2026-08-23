## ARINOVA Data Privacy & Compliance Report

### A. DATA WE COLLECT & B. WHY WE COLLECT IT & C. WHERE IT IS STORED
- **User Authentication**: ID, Email, Password Hash, Provider (Google/GitHub/Email). Stored in `auth.users`, `auth.identities`. Needed for secure login.
- **Profiles**: Display Name, Avatar, Bio, Links. Stored in `public.profiles`. Needed for user identity and social interaction.
- **GitHub Data**: GitHub Username, Repositories, Languages. Stored in `public.github_connections`, `public.external_projects`. Needed to showcase developer skills.
- **Social Graph**: Friends, Blocks, Mutes. Stored in `public.friends`, `public.blocks`, `public.mutes`. Needed for user social controls.
- **Chat Messages (1-on-1)**: Text, sender, receiver, timestamps. Stored in `public.profiles` (JSONB `chat` key). Needed for direct messaging.
- **Group Chats**: Group metadata, membership, messages. Stored in `public.chat_groups`, `public.chat_group_members`, `public.group_messages`.
- **Support Tickets**: Issue description, category, attachments, AI/Official responses. Stored in `public.support_tickets`, `public.support_messages`. Needed for customer support.

### D. THIRD PARTIES & E. INTERNATIONAL DATA FLOWS
- **Supabase**: Backend Database, Auth, Storage, Edge Functions. Data is hosted on Supabase servers (AWS).
- **Groq**: AI Provider. Edge functions send Support Ticket context to Groq API for processing. We do NOT use Groq for private 1-on-1 chats.
- **GitHub**: OAuth Provider & API. We pull public repository data.

### F. DATA RETENTION & L. ACCOUNT DELETION
- **Retention**: Data is retained until account deletion.
- **Account Deletion**: `delete_user_account()` RPC deletes `auth.users`, which cascades to `profiles`, `friends`, `chat_groups` (if owner), `support_tickets`, `external_projects`.
- **Chat Retention**: 1-on-1 chats are duplicated in both sender and receiver profiles. Account deletion removes the sender's copy, but the recipient retains their copy (standard industry practice).

### G. USER RIGHTS & H. SECURITY
- Users can delete their accounts directly.
- Users can close and permanently delete Support Tickets.
- RLS policies restrict access (e.g., users can only read their own 1-on-1 messages, group members can only read their group messages).

### J. AI PROCESSING
- AI processing ONLY occurs for Support Tickets (tier-1 support).
- We use the `openai/gpt-oss-20b` (or active equivalent) via Groq. The ticket description and follow-up messages are sent.

### O. FIXES IMPLEMENTED
1. **Data Controls UI**: Built a dedicated Privacy & Security section in Settings.
2. **Account Deletion Validation**: Verified cascading deletes in Supabase schema.

