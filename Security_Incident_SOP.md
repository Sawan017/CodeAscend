# Security Incident Response SOP

**Purpose:** To establish a clear internal procedure for handling suspected or confirmed security incidents, data breaches, or exposed credentials.

## 1. Identification and Triage
- Monitor internal error logs (Supabase Edge Functions, backend monitoring) for abnormal activity.
- Any employee discovering an exposed secret (e.g., API key committed to GitHub) or unauthorized database access must immediately report it to the engineering lead.

## 2. Containment
- **Compromised Credentials/Secrets:** Immediately revoke and rotate the affected API key (e.g., Groq API key, Supabase Service Role key) from the respective provider dashboard.
- **Unauthorized Database Access:** Temporarily disable the affected user account(s) or tighten Row Level Security (RLS) policies if a bypass vulnerability is discovered.
- **AI Provider Exposure:** If sensitive unintended data is routed to Groq, immediately halt the `support-ai` Edge Function until the prompt/routing logic is patched.

## 3. Eradication & Recovery
- Patch the vulnerability (e.g., updating RLS, removing debug stack traces from client responses).
- Re-deploy the Edge Functions or Database migrations.
- Verify that standard functionality has been restored.

## 4. Notification & Logging
- **Internal Logging:** Document the incident timeline, cause, and resolution in the internal Security Incident Log. Never log sensitive credentials in this document.
- **User Notification:** If a breach results in the exposure of unencrypted personal data (e.g., chat messages or emails), impacted users must be notified within 72 hours, in compliance with applicable data protection regulations (e.g., GDPR, DPDP Act).
