# ARINOVA – DPDP Rules 2025 Commencement & Compliance Matrix

**Status**: PRE-DEPLOYMENT (COMMERCIAL LAUNCH DEFERRED)
**Last Updated**: 2026-08-25

> [!IMPORTANT]
> **DEVELOPMENT / STUDENT PROJECT NOTICE**
> ARINOVA is currently a student/development project. This matrix tracks technical implementation against the Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025.
> **Deployment is intentionally deferred.** Legal review, provider verification, and business incorporation are mandatory prior to any public/commercial launch.

## 1. Compliance Matrix

| Requirement | Legal Source | Currently In Force? | Implementation Status | Technical Implementation | Manual / Legal Action Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Notice (Multi-Language)** | DPDP Act Sec 5(3) & Rules 2025 | YES | ?? PARTIAL | Extensible \legalLanguages\ config supports dynamic UI switching. English implemented. | **[LEGAL REVIEW]** Requires certified translation for Hindi placeholder. |
| **Consent Unbundling** | DPDP Act Sec 6(1) | YES | ? FULLY IMPLEMENTED | Separate discrete checkboxes for ToS, Privacy, and Age confirmation in \LoginUI.tsx\. | None |
| **Consent Withdrawal** | DPDP Act Sec 6(4) | YES | ? FULLY IMPLEMENTED | Users can delete account via \delete_user_account()\ RPC, halting all processing. | None |
| **Verifiable Parental Consent** | DPDP Act Sec 9(1) | YES | ? FULLY IMPLEMENTED | ARINOVA strictly prohibits under-18s at signup, sidestepping VPC via business logic. | None |
| **Right to Access/Summary** | DPDP Act Sec 11(1) | YES | ? FULLY IMPLEMENTED | \export_user_data()\ RPC provides a full JSON export of all database rows tied to user. | None |
| **Right to Correction** | DPDP Act Sec 12(1) | YES | ? FULLY IMPLEMENTED | Users can directly modify their profile/settings in UI. | None |
| **Right to Erasure** | DPDP Act Sec 12(3) | YES | ? FULLY IMPLEMENTED | \delete_user_account()\ cascades deletion across all tables (\ON DELETE CASCADE\). | None |
| **Right of Grievance Redressal** | DPDP Act Sec 13 | YES | ?? PARTIAL | \DataRightsRequestForm\ UI routes tickets correctly. Officer config mechanism exists. | **[PENDING LAUNCH]** Appoint Grievance Officer, replace \legalText.ts\ placeholders. |
| **Right to Nominate** | DPDP Act Sec 14 | YES | ? FULLY IMPLEMENTED | \user_nominees\ table and RPCs limit to max 3 nominees. UI manager implemented. | None |
| **Personal Data Breach Notification** | DPDP Act Sec 8(6) & Rules 2025 | YES | ?? PARTIAL | \DPDP_DATA_BREACH_RESPONSE_PLAN.md\ playbook established. | **[LEGAL REVIEW]** Confirm exact hourly reporting deadline (e.g., 72 hours) from final Rules. |
| **Reasonable Security Safeguards** | DPDP Act Sec 8(5) | YES | ? FULLY IMPLEMENTED | Universal RLS, Turnstile CAPTCHA, RPC \search_path\ locks, Groq PII minimizer. | None |
| **Data Processor Agreements (DPA)** | DPDP Act Sec 8(2) | YES | ?? PARTIAL | Processors inventoried in \DPDP_PROCESSOR_DPA_REGISTER.md\. Groq training policy verified. | **[PENDING LAUNCH]** Formally execute DPAs with Supabase, Vercel/Cloudflare, Groq. |
| **Cross-Border Transfers** | DPDP Act Sec 16(1) | YES | ?? PARTIAL | \DPDP_DATA_LOCATION_REGISTER.md\ implemented. Supabase region confirmed as Sydney. | **[LEGAL REVIEW]** Confirm Australia (Sydney) is not on Government's restricted negative list. |

## 2. Technical vs. Legal Separation

### A. Technically Implemented & Verified
*   All Data Principal Rights (Erasure, Correction, Access, Portability, Nomination).
*   Consent unbundling and version tracking (\user_legal_consents\).
*   Database security (RLS, search-paths, constraints, cascading deletes).
*   AI Data Minimization (PII regex scrubbing in Edge Functions).
*   Child-data restriction (Over-18 blocker).

### B. Documentation Implemented
*   Data Retention Register (\DPDP_DATA_RETENTION_REGISTER.md\).
*   Data Location Register (\DPDP_DATA_LOCATION_REGISTER.md\).
*   Processor DPA Register (\DPDP_PROCESSOR_DPA_REGISTER.md\).
*   Breach Response Plan (\DPDP_DATA_BREACH_RESPONSE_PLAN.md\).
*   Privacy Policy structures injected with explicit Launch Placeholders.

### C. Provider-Dependent Verification
*   Vercel/Cloudflare log retention periods (Requires dashboard check upon final deployment tier).

### D. Real-World Business / Legal Action Required
*   **[PENDING LAUNCH: LEGAL_ENTITY_NAME]**: Incorporate/register a commercial entity.
*   **[PENDING LAUNCH: GRIEVANCE_OFFICER]**: Appoint a statutory officer and publish their physical address/email.
*   Formally accept vendor Terms of Service / DPAs on behalf of the registered entity.

### E. Lawyer / Legal Review Required
*   Verify cross-border compliance for the Supabase \p-southeast-2\ region.
*   Verify the exact breach notification deadline limit for the finalized rules.
*   Commission a legally certified Hindi translation of the Privacy Notice and Terms.
