# Roadmap and acceptance criteria

## Phase 0 — Discovery and spikes (1–2 weeks)

Deliver:

- product/technical blueprint;
- official provider pricing and privacy matrix;
- Spanish/English STT, LLM and TTS benchmark harness;
- Unity vs lightweight avatar spike;
- WebSocket vs WebRTC ADR;
- clickable UX prototype;
- threat model and cost model.
- original modern-manga art direction and three low-fidelity character sheets.
- a bootstrap budget showing how alpha operation remains below USD 1,000/month.

Exit criteria:

- at least two viable routes per critical AI capability;
- measured latency/quality/cost on representative devices and networks;
- no unresolved blocker for commercial terms or target-region data flow;
- selected vertical-slice stack.
- projected monthly spend stays at or below $800 before the $200 contingency reserve.

## Phase 1 — Internal vertical slice (3–5 weeks)

Deliver:

- auth and onboarding;
- one companion;
- text plus push-to-talk voice;
- streaming response and interruption;
- basic lip sync/emotion states;
- memory proposal, edit and deletion;
- mock entitlements and usage meter;
- observability and cost events;
- automated tests and CI.

Exit criteria:

- 20-minute scripted test without unrecoverable failure;
- no secrets in mobile bundle/repository;
- p50/p95 latency captured;
- every turn has auditable cost estimate;
- deletion prevents deleted memory from retrieval;
- fallback route passes chaos test.

## Phase 2 — Private alpha (3–4 weeks)

Deliver:

- three companions;
- Spanish/English localization;
- RevenueCat sandbox purchases;
- real plan limits/add-ons;
- account export/deletion;
- reporting and safety flows;
- remote config, spend caps and provider kill switch.

Exit criteria:

- begin with 25 invited adults, then expand toward 50–100 only when usage cost and safety results support it;
- privacy/security checklist complete;
- no critical crash or cross-user isolation defect;
- contribution cost measured per cohort;
- safety escalation reviewed manually.

## Phase 3 — Beta and launch readiness (4–8 weeks)

Deliver:

- performance and animation polish;
- provider contracts/quotas;
- store assets, privacy disclosures and support flow;
- experiments on plans and voice modes;
- incident runbook and dashboards.

Exit criteria:

- crash-free sessions target defined and met;
- fallback capacity tested;
- p95 paid-user economics acceptable;
- store/compliance review complete;
- on-call ownership and budget alarms active.

## Backlog after validation

- hands-free mode;
- optional proactive messages;
- additional languages;
- richer gestures;
- safe original voice creation;
- desktop/web companion;
- user-created appearance within moderation;
- premium realtime route.

Do not prioritize these until retention and unit economics validate the core loop.
