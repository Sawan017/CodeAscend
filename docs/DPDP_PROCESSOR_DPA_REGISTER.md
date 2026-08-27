# DPDP Processor DPA Register

**Status**: REQUIRES LEGAL REVIEW
**Last Updated**: 2026-08-25

> [!IMPORTANT]
> **DEVELOPMENT / STUDENT PROJECT NOTICE**
> ARINOVA is currently a student/development project operated by an individual developer, not a commercial legal entity.
> This register tracks technical integrations. No legally binding Data Processing Agreements (DPAs) or formal processor vetting has been completed. All processor compliance must be verified prior to public or commercial launch.

| Processor/Vendor | Service Provided | Categories of Data Processed | Purpose | DPA Status | AI Training Restrictions | Verification Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Supabase** | DB, Auth, Storage, Edge Functions | All user data, credentials, profiles, chat, legal consents | Core application backend and hosting | [NEEDS VERIFICATION] | [NEEDS VERIFICATION] | YYYY-MM-DD |
| **Cloudflare** | Turnstile CAPTCHA | IP address, browser telemetry | Bot mitigation / auth security | [NEEDS VERIFICATION] | [NEEDS VERIFICATION] | YYYY-MM-DD |
| **Groq** | AI Inference / LLM | Support ticket context | Tier-1 automated support | [NEEDS VERIFICATION] | ✅ VERIFIED (No Default Training) | 2026-08-25 |
| **GitHub** | OAuth Provider | GitHub username, repositories | Developer profile integration | [NEEDS VERIFICATION] | N/A | YYYY-MM-DD |

## Required Actions Before Launch:
1. Verify existing vendor Terms of Service / standard DPAs.
2. Ensure explicit clauses prevent vendors (especially Groq) from using ARINOVA personal data to train their foundational AI models.
3. Verify clauses dictating data return/deletion upon termination of the contract.
