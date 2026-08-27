# ARINOVA — DPDP Compliance Status Register

**Last Updated**: 2026-08-25  
**Framework**: Digital Personal Data Protection Act, 2023 + DPDP Rules, 2025

> [!IMPORTANT]
> **DEVELOPMENT / STUDENT PROJECT NOTICE**
> ARINOVA is currently a student/development project operated by an individual developer, not a commercial legal entity.
> Deployment is intentionally deferred. The project's current technical privacy/data-rights implementation provides a foundation for future public or commercial deployment.
> All remaining business, provider dashboard verifications, and legal requirements will be handled prior to public launch.
> This document tracks technical implementation status only and does NOT constitute legal certification or current DPDP compliance.

---

## A. IMPLEMENTED

| Requirement | Implementation | Evidence | Status |
| :--- | :--- | :--- | :--- |
| Consent Unbundling | Separate checkboxes for ToS, Privacy, Age | `src/features/auth/LoginUI.tsx` | ✅ DONE |
| Consent Versioning | `user_legal_consents` table with timestamps | `supabase/migrations/20260822900004_legal_consents.sql`, `20260825000007_store_consent.sql` | ✅ DONE |
| Right to Erasure | `delete_user_account()` RPC with cascading deletion | `supabase/migrations/20260825000000_fix_account_deletion.sql` | ✅ DONE |
| Right to Access / Portability | `export_user_data()` RPC returns full JSON export | `supabase/migrations/20260824000001_complete_data_export.sql` | ✅ DONE |
| Right to Correction | Users can edit profile fields directly | `src/features/settings/SettingsDrawer.tsx` | ✅ DONE |
| Right to Nomination (Sec 14) | `user_nominees` table + NomineeManager UI | `supabase/migrations/20260825140000_user_nominees.sql`, `SettingsDrawer.tsx` | ✅ DONE |
| Children's Data (Sec 9) | Over-18 checkbox blocker at signup | `src/features/auth/LoginUI.tsx` | ✅ DONE |
| Security Safeguards | RLS, Turnstile CAPTCHA, rate limiting, auth hooks | Multiple migrations | ✅ DONE |
| RPC Search Path Integrity | Elevated SECURITY DEFINER functions use explicit search paths | `supabase/migrations/20260825140000_user_nominees.sql` | ✅ FIXED |
| PII Minimization (AI) | Regular expressions scrub PII before Groq AI requests | `supabase/functions/support-ai/index.ts` | ✅ FIXED |
| Grievance Officer Disclosure | Centralized config + Privacy Policy Section 7 + UI | `src/features/settings/legalText.ts`, `SettingsDrawer.tsx` | ✅ DONE |
| Data Subject Request Tracking | `data_subject_requests` table + DataRightsRequestForm UI | `supabase/migrations/20260825140001_data_subject_requests.sql`, `SettingsDrawer.tsx` | ✅ DONE |
| Multi-Language Notice Structure | Extensible `legalLanguages` registry | `src/features/settings/legalText.ts` | ✅ DONE |
| Privacy Policy — Legal Entity | `LEGAL_ENTITY_NAME` config in legalText.ts | `src/features/settings/legalText.ts` | ✅ DONE |
| Privacy Policy — Rights Listed | Access, Correction, Erasure, Withdrawal, Nomination, Grievance | `src/features/settings/legalText.ts` Section 6 | ✅ DONE |
| Data Breach Response Plan | Operational playbook with checklist | `docs/DPDP_DATA_BREACH_RESPONSE_PLAN.md` | ✅ DONE |
| DPA Register | Processor inventory with verification status | `docs/DPDP_PROCESSOR_DPA_REGISTER.md` | ✅ DONE |
| Data Retention Register | Category-level retention documentation | `docs/DPDP_DATA_RETENTION_REGISTER.md` | ✅ DONE |
| Data Location Register | Infrastructure location tracking | `docs/DPDP_DATA_LOCATION_REGISTER.md` | ✅ DONE |

---

## B. IMPLEMENTED BUT REQUIRES OPERATIONAL PROCESS

| Requirement | What Exists | Remaining Action | Priority |
| :--- | :--- | :--- | :--- |
| Grievance Response Timelines | `data_subject_requests` table tracks timestamps | Must operationally monitor and respond within applicable deadlines | HIGH |
| Data Breach Notification | `docs/DPDP_DATA_BREACH_RESPONSE_PLAN.md` | Must assign real incident response owners and test the plan | HIGH |
| Nominee Verification | `user_nominees` table supports status field | Operational process for verifying nominee identity during actual exercise of rights | MEDIUM |
| Support vs Grievance Routing | UI distinguishes support tickets from formal grievances | Must ensure operators handle formal grievances separately | MEDIUM |

---

## C. REQUIRES FUTURE PUBLIC/COMMERCIAL LAUNCH INFORMATION

| Item | Current State | Action Required Prior to Commercial Launch | Priority |
| :--- | :--- | :--- | :--- |
| Grievance Officer Name | `[PENDING LAUNCH: GRIEVANCE_OFFICER_NAME]` placeholder | Future operator/legal entity must supply real name | **CRITICAL** |
| Grievance Officer Email | `[PENDING LAUNCH: GRIEVANCE_OFFICER_EMAIL]` placeholder | Future operator/legal entity must supply real email | **CRITICAL** |
| Grievance Officer Address | `[PENDING LAUNCH: GRIEVANCE_OFFICER_ADDRESS]` placeholder | Future operator/legal entity must supply real address | **CRITICAL** |
| Legal Entity Name | `[PENDING LAUNCH: LEGAL_ENTITY_NAME]` placeholder | Future operator/legal entity must supply registered name | **CRITICAL** |
| Hindi Privacy Notice | Placeholder text in `legalLanguages` | Future operator must commission legally reviewed Hindi translation | HIGH |
| Data Breach Notification Deadline | Marked `[REQUIRES LEGAL VERIFICATION]` | Confirm exact deadline from final DPDP Rules | HIGH |
| DPA Verification | All processors marked `[NEEDS VERIFICATION]` | Review actual vendor terms/DPAs | HIGH |

---

## D. REQUIRES PROVIDER VERIFICATION

| Item | Current State | Action Required | Priority |
| :--- | :--- | :--- | :--- |
| Supabase Database Region | `✅ VERIFIED: ap-southeast-2 (Sydney)` | Confirmed via Dashboard | DONE |
| Supabase Backup Retention | `✅ VERIFIED: 0 days (Free Plan)` | Scheduled Backups & PITR unavailable | DONE |
| Server Log Retention | `[REQUIRES PROVIDER VERIFICATION]` | Verify Vercel/Cloudflare log retention | MEDIUM |
| Groq Data Processing | `✅ VERIFIED: No Training (Default)` | Verified from official API docs that Groq does not use inputs for training | DONE |

---

## E. NOT APPLICABLE

| Requirement | Reason |
| :--- | :--- |
| Significant Data Fiduciary (SDF) | ARINOVA is not notified as an SDF by the government |
| Consent Manager | ARINOVA is a Data Fiduciary, not a Consent Manager |
| Verifiable Parental Consent | Platform restricts signup to 18+ only |
