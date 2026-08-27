// ==========================================================================
// DPDP DEPLOYMENT CONFIGURATION
// ==========================================================================
// Replace placeholder values with real business details before public launch.
// These are used throughout the Privacy Policy and UI.

export const LEGAL_ENTITY_NAME = '[PENDING LAUNCH: LEGAL_ENTITY_NAME]' // e.g. "ARINOVA Technologies Pvt. Ltd."

export const GRIEVANCE_OFFICER = {
  name: '[PENDING LAUNCH: GRIEVANCE_OFFICER_NAME]',
  email: '[PENDING LAUNCH: GRIEVANCE_OFFICER_EMAIL]',
  address: '[PENDING LAUNCH: GRIEVANCE_OFFICER_ADDRESS]',
}

export const privacyPolicyText = `
# ARINOVA Privacy Policy

**Last Updated**: August 25, 2026  
**Operated by**: ${LEGAL_ENTITY_NAME}

> **DEVELOPMENT / STUDENT PROJECT NOTICE**: ARINOVA is currently a student/development project operated by an individual developer. It is not currently operated by a commercial legal entity. The legal and business details (such as the Grievance Officer and Legal Entity) required for full DPDP compliance are marked as placeholders and must be established prior to any public or commercial launch.

## 1. Introduction
Welcome to ARINOVA, operated by ${LEGAL_ENTITY_NAME}. Your privacy is critically important to us. This Privacy Policy explains exactly what data we collect, why we collect it, where it is stored, and how you can control it. We only collect the minimum information required to operate ARINOVA.

## 2. What Data We Collect
### A. Account Information
- **User ID & Authentication**: We store a unique User ID and authentication credentials (such as password hashes or OAuth tokens) to secure your account.
- **Optional Email**: If provided, your email is used *only* for account security and recovery. We do not use security emails for marketing.
- **Profile Information**: Display name, bio, and avatars are collected to represent you on the platform.

### B. Social & Communication Data
- **Social Graph**: We store friend requests, blocks, mutes, and group memberships.
- **Chat Messages**: Direct (1-on-1) and group chat messages are stored to provide messaging functionality. Note that 1-on-1 messages are securely duplicated in both the sender's and receiver's private profiles. 
- **Support Tickets**: Support requests, including issue descriptions and attached screenshots, are stored to assist you.

### C. GitHub Integrations
- If you connect your GitHub account, we collect your GitHub username, repository information, and language statistics to showcase your developer skills. We do NOT store your GitHub private access tokens after initial sync, and we do NOT access private repositories.

## 3. How Data is Used
We use your data strictly to:
- Provide and maintain the ARINOVA platform.
- Secure your account and prevent abuse.
- Deliver tier-1 AI support via external partners.

**We do NOT:**
- Secretly track your location or behavioral patterns.
- Sell or share your personal data with advertisers.

## 4. Third-Party Services
To operate ARINOVA, we securely integrate with the following third parties:
- **Supabase**: Our primary backend database, authentication, and hosting provider. All data is securely processed via Supabase.
- **Cloudflare Turnstile**: Used to protect our authentication endpoints from automated abuse (e.g., bots, spam). Cloudflare may process your IP address and limited browser telemetry during login/signup to verify human status without tracking you across sites.
- **Groq (AI Provider)**: When you submit a support ticket, the ticket context and conversation are processed by Groq's APIs using models such as \`openai/gpt-oss-20b\` to provide automated support. **We do not send your private 1-on-1 chat messages to Groq.** [REQUIRES GROQ PROVIDER VERIFICATION: verify that Groq does not train on user data]
- **GitHub**: Used for OAuth authentication and developer profile syncing.

## 5. Data Retention & Account Deletion
- **Retention**: Your account data and messages are retained until you choose to delete your account. 
- **Account Deletion**: You can permanently delete your account at any time via the Privacy & Security settings. Deleting your account immediately removes your authentication profile, linked identities, avatars, support tickets, and your copy of chat messages. 
- **Important Exception**: Like most messaging platforms, deleting your account does NOT automatically delete the recipient's copy of messages you previously sent to them.

## 6. Your Rights
Under applicable laws (including the Digital Personal Data Protection Act, 2023), you have the right to:
- **Access & Export**: Access and export your personal data via the Privacy & Security settings.
- **Correction**: Correct inaccurate profile information directly from your profile settings.
- **Erasure**: Delete your account and associated personal data at any time.
- **Withdrawal of Consent**: Withdraw your consent for data processing. Note that withdrawing consent may limit your ability to use certain features.
- **Nomination**: Nominate a person to exercise your data rights in the event of your death or incapacity, via the Privacy & Security settings.
- **Grievance Redressal**: Raise a formal grievance regarding your personal data (see Section 7 below).
- **Disconnect Integrations**: Disconnect third-party integrations (e.g., GitHub).

## 7. Contact Us & Grievance Redressal
If you have any questions, concerns, or grievances regarding your personal data or this Privacy Policy, you may contact our designated Grievance Officer:

**Grievance Officer**: ${GRIEVANCE_OFFICER.name}  
**Email**: ${GRIEVANCE_OFFICER.email}  
**Address**: ${GRIEVANCE_OFFICER.address}  

**How to Submit a Grievance**:
You may submit a formal grievance by emailing the Grievance Officer directly at the email address provided above. Please include "Grievance" in the subject line to ensure proper handling.

**Note on Support Tickets**: You may also use the in-app Support Ticket system to seek general assistance or resolve account issues. However, formal data protection grievances under the DPDP Act should be directed to the Grievance Officer using the contact details above.
`;

export const termsOfServiceText = `
# ARINOVA Terms of Service

**Last Updated**: August 22, 2026

## 1. Acceptance of Terms
By creating an account and using ARINOVA, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.

## 2. User Accounts
- **Responsibility**: You are responsible for maintaining the security of your account credentials. ARINOVA cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.
- **Accuracy**: You agree to provide accurate, current, and complete information during the registration process.

## 3. Acceptable Use
You agree not to use ARINOVA to:
- Violate any local, state, national, or international law.
- Harass, abuse, threaten, or impersonate other users.
- Distribute spam, malware, or unsolicited promotional content.
- Infringe upon the intellectual property rights of others.
- Exploit or endanger minors in any way.

## 4. Moderation & Termination
ARINOVA reserves the right, but not the obligation, to monitor content and interactions. We reserve the right to suspend or terminate your account immediately, without prior notice, if you violate these Terms or engage in conduct that harms the platform or its users.

## 5. Third-Party Integrations & AI Support
- **AI Limitations**: ARINOVA utilizes automated AI for tier-1 support. AI-generated responses are provided "as is" and may occasionally be inaccurate. You may request human escalation if the AI cannot resolve your issue.
- **External Services**: We integrate with third-party services like GitHub. Your use of those services is governed by their respective terms and privacy policies.

## 6. Limitation of Liability
To the maximum extent permitted by applicable law, ARINOVA shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.

## 7. Legal Requests
ARINOVA complies with legally valid requests from law enforcement authorities when legally required. We disclose only the information legally required and will attempt to verify the authenticity and scope of all requests. We do not implement mechanisms to evade lawful authorities.

## 8. Changes to Terms
We reserve the right to modify these Terms at any time. We will notify users of significant changes. Continued use of ARINOVA after such modifications constitutes acceptance of the updated Terms.
`;

// ==========================================================================
// MULTI-LANGUAGE PRIVACY NOTICE SUPPORT
// ==========================================================================
// DPDP Rules may require the Privacy Notice in languages listed in
// Schedule VIII of the Constitution. Add legally reviewed translations
// below. Do NOT use machine translations as legally authoritative text.
//
// Status: Only English is currently available.
// Action: Replace placeholder entries with legally reviewed translations
//         before launch if required by the applicable commencement schedule.

export type LegalLanguage = {
  code: string
  label: string
  nativeLabel: string
  privacyPolicy: string
  termsOfService: string
  status: 'reviewed' | 'placeholder'
}

export const legalLanguages: LegalLanguage[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    privacyPolicy: privacyPolicyText,
    termsOfService: termsOfServiceText,
    status: 'reviewed',
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    privacyPolicy: '⚠️ [LEGALLY REVIEWED HINDI TRANSLATION REQUIRED] — This is a placeholder. A legally reviewed Hindi translation of the ARINOVA Privacy Policy must replace this text before public launch.',
    termsOfService: '⚠️ [LEGALLY REVIEWED HINDI TRANSLATION REQUIRED] — This is a placeholder. A legally reviewed Hindi translation of the ARINOVA Terms of Service must replace this text before public launch.',
    status: 'placeholder',
  },
]

export function getPrivacyPolicyForLanguage(code: string): string {
  const lang = legalLanguages.find(l => l.code === code)
  return lang?.privacyPolicy ?? privacyPolicyText
}

export function getTermsForLanguage(code: string): string {
  const lang = legalLanguages.find(l => l.code === code)
  return lang?.termsOfService ?? termsOfServiceText
}
