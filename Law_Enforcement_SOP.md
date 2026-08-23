# Law Enforcement & Legal Request SOP

**Purpose:** To provide a standardized response mechanism for legally valid requests for user data from authorities.

## 1. Receiving a Request
- All legal requests must be directed to `legal@arinova.example.com`.
- Employees must not disclose data over the phone or social media to anyone claiming to be law enforcement.

## 2. Verifying Authenticity
- Verify that the request originates from an official government or law enforcement domain.
- Confirm the legal mandate (Subpoena, Court Order, Search Warrant) applicable under the jurisdiction (e.g., Indian Information Technology Act).

## 3. Scope Determination & Preservation
- Review the request to determine if it is overly broad.
- If necessary, immediately preserve the targeted records to prevent deletion while the request is evaluated. (Note: ARINOVA does not auto-delete accounts unless requested by the user, but preservation ensures the data remains intact).

## 4. Disclosure Policy
- Disclose **ONLY** what is explicitly legally required.
- Standard metadata (IPs, login times, linked emails) will be provided if a subpoena is valid.
- Content data (private chat messages, support tickets) requires a valid Search Warrant or equivalent judicial order.
- ARINOVA **does not** maintain "backdoors" or direct database access portals for authorities. All extractions must be executed manually by a senior database administrator via secure PostgreSQL access.

## 5. Escalation & Documentation
- Unclear, overly broad, or international requests must be escalated to qualified external legal counsel before disclosure.
- All disclosures must be documented in the internal Legal Request Log.
