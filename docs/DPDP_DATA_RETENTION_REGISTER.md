# DPDP Data Retention Register

**Status**: REQUIRES PROVIDER VERIFICATION
**Last Updated**: 2026-08-25

> [!IMPORTANT]
> **DEVELOPMENT / STUDENT PROJECT NOTICE**
> ARINOVA is currently a student/development project operated by an individual developer. It is not currently operated by a commercial legal entity.
> Deployment is intentionally deferred. This register documents technical data retention mechanisms and does not establish a legally certified retention policy.
> Business retention periods and final provider integrations will be verified prior to public/commercial launch.

| Data Category | Purpose | Retention Period | Deletion Mechanism | Responsible System | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Account & Profile** | Platform functionality | Until account deletion | `delete_user_account` RPC | Postgres (ON DELETE CASCADE) | VERIFIED |
| **Chat Messages (Sent)** | Platform functionality | Until account deletion | `delete_user_account` RPC | Postgres | VERIFIED |
| **Support Tickets (User)** | Customer support | Until account deletion | `delete_user_account` RPC | Postgres | VERIFIED |
| **Legal Consents** | Proof of compliance | Duration of account + [LEGAL_REVIEW] | `delete_user_account` RPC | Postgres | VERIFIED |
| **Database Backups (Supabase)** | Disaster Recovery | 0 days (Free Plan: Scheduled Backups & PITR Unavailable) | N/A | Supabase PITR/Backups | ✅ Dashboard Verified |
| **Server/Edge Logs** | Security & Debugging | [REQUIRES PROVIDER VERIFICATION] | Automated by provider | Vercel / Supabase Logs | [NEEDS VERIFICATION] |
| **Auth Logs** | Security | [REQUIRES PROVIDER VERIFICATION] | Automated by Supabase | Supabase Auth | [NEEDS VERIFICATION] |
| **Storage Attachments** | Support documentation | Until account deletion | Frontend Edge function + API | Supabase Storage | VERIFIED |

## Required Actions Before Launch:
1. Verify Supabase's default backup retention (typically 7-30 days based on plan) and document it.
2. Verify log retention on hosting platforms (Vercel/Cloudflare) and document it.
3. Ensure the Privacy Policy accurately reflects these physical backup retention delays (e.g., "Deleted data may remain in secure encrypted backups for up to X days").
