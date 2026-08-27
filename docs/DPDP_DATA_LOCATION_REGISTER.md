# DPDP Data Location Register

**Status**: REQUIRES SUPABASE DASHBOARD VERIFICATION
**Last Updated**: 2026-08-25

> [!IMPORTANT]
> **DEVELOPMENT / STUDENT PROJECT NOTICE**
> ARINOVA is currently a student/development project operated by an individual developer, not a commercial legal entity.
> This register documents the infrastructure currently used for development. Legal verification of cross-border data transfer rules is required prior to public or commercial launch.

| Service | Component | Physical Region / Location | Source / Evidence | Verification Date |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase** | PostgreSQL Database | ap-southeast-2 (Sydney) | ✅ Dashboard Verified | 2026-08-25 |
| **Supabase** | Storage | ap-southeast-2 (Sydney) | ✅ Dashboard Verified | 2026-08-25 |
| **Supabase** | Auth | ap-southeast-2 (Sydney) | ✅ Dashboard Verified | 2026-08-25 |
| **Cloudflare** | Turnstile | Global (Anycast) | Cloudflare Architecture | YYYY-MM-DD |
| **Groq** | AI Inference | US / Global [REQUIRES VERIFICATION] | Groq Documentation | YYYY-MM-DD |
| **GitHub** | OAuth | US / Global | GitHub Infrastructure | YYYY-MM-DD |

## Required Actions Before Launch:
1. Log into the Supabase Dashboard and identify the exact AWS/GCP region selected for the project (e.g., `ap-south-1` Mumbai, `us-east-1` N. Virginia).
2. Record the region above.
3. Consult legal counsel regarding the final notified rules on cross-border data transfers to ensure the selected region is not on a restricted/negative list by the Central Government.
