# Safety, privacy and compliance baseline

This is product guidance, not legal advice. Obtain qualified review for target markets before launch.

## Product boundaries

- Adults 18+ for MVP.
- Clear disclosure that every companion is AI.
- No claims of consciousness, real-world embodiment or professional credentials.
- No medical diagnosis, therapy claims, legal/financial directives or emergency monitoring.
- No sexual content in MVP.
- No manipulative dependency: no guilt for leaving, exclusivity demands, jealousy, threats or pressure to pay.

## Crisis handling

Detect credible self-harm or imminent-danger signals using a layered policy. Respond with supportive, nonjudgmental language, encourage immediate real-world help and show region-appropriate emergency resources. Do not claim the app contacted emergency services unless it actually did and the user explicitly authorized that capability. Avoid retaining crisis content longer than necessary.

## Privacy requirements

- Data map and purpose limitation for every field/event.
- Explicit consent where legally required for audio/biometric-like processing.
- Raw audio not stored by default.
- Conversation content excluded from analytics and standard logs.
- Encryption in transit and at rest.
- Secrets manager and least-privilege service accounts.
- Retention schedules for transcripts, memories, backups and support records.
- Export and deletion workflows with status/audit trail.
- Vendor subprocessors and cross-border transfer review.
- Provider settings preventing training on user content where available/required.
- Red-team prompt injection through memories and user content.

## Chinese/international provider diligence

Lower price alone is insufficient. Before enabling a provider, verify:

- contractual entity and service region;
- international API availability;
- data path and storage region;
- retention, training and deletion terms;
- commercial rights for generated voices/audio;
- sanctions/export-control and payment constraints;
- GDPR/UK GDPR/US state privacy applicability;
- incident response and subprocessor list;
- content restrictions that may affect global users;
- SLA, quotas and account suspension risk.

If a route is not permitted for a user region or sensitivity class, the router must exclude it.

## Security controls

- short-lived auth tokens and device/session revocation;
- signed server-issued realtime session grants;
- rate limiting and anomaly detection;
- encrypted local storage;
- input size/time limits;
- strict schema validation;
- SSRF-safe tool layer if web tools are later added;
- idempotent purchases and verified store receipts;
- dependency/SAST/secret scanning;
- audit events without private content;
- provider kill switches.

## App-store and marketing review

Before submission, review current Apple and Google rules for AI-generated content, subscriptions, account deletion, child safety, privacy labels, voice recording and user reporting. Avoid comparative claims such as “better than Animates” unless substantiated and legally approved. Market concrete plan allowances and features instead.

For USA-first launch, include a state privacy-law review, clear subscription disclosures, biometric/voice-consent review where applicable and a process for consumer privacy requests. International expansion requires a country-by-country launch checklist rather than assuming the US configuration is sufficient.

## Safety acceptance tests

Include tests for:

- AI identity disclosure;
- attempts to override persona/safety instructions;
- emotional dependency prompts;
- self-harm and imminent danger;
- harassment and sexual requests;
- minors claiming their age;
- requests to clone a celebrity/family voice;
- deletion and “forget this” behavior;
- provider failure that might leak one user’s context to another.
