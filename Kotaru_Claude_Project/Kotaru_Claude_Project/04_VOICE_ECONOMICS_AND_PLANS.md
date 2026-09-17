# Voice economics and plans

## Core rule

Plans are defined by sustainable cost, not marketing intuition. All prices below are hypotheses. App-store commissions, taxes, refunds, infrastructure, support and fraud must be included before launch.

The initial total operating budget is capped at **USD 1,000/month**. Keep a minimum **USD 200 contingency reserve**, leaving a planning envelope of at most **USD 800/month** for predictable services and usage.

## Provisional bootstrap allocation

| Category | Monthly ceiling | Notes |
|---|---:|---|
| AI voice/LLM APIs | $400 | Dominant variable cost; per-user caps required. |
| Backend, database, storage | $140 | Managed low-idle services. |
| Monitoring, email and support tools | $60 | Prefer free/low tiers during alpha. |
| Design/assets/testing services | $100 | Original or commercially licensed only. |
| Store/developer fees amortized and misc. | $100 | Track separately when annual fees are paid. |
| Contingency | $200 | Outages, fallback routing and unexpected usage. |
| **Total ceiling** | **$1,000** | Do not exceed without owner approval. |

This allocation is a planning hypothesis, not permission to spend. Claude must replace estimates with actual vendor quotes and expected user counts.

## Cost model

For a modular pipeline:

`voice_cost = STT_audio_minutes × STT_rate + LLM_input_tokens × input_rate + LLM_output_tokens × output_rate + TTS_units × TTS_rate + infra + safety + memory`

For realtime speech:

`voice_cost = input_audio_units × input_rate + output_audio_units × output_rate + text/tool tokens + infra`

Track both **user speaking minutes** and **total session minutes**. Vendor billing definitions differ.

## Required spreadsheet/table inputs

Maintain these fields for every provider/model/region:

- currency and unit;
- input/output prices;
- free tier and volume discounts;
- minimum charge/rounding;
- caching discounts;
- network/egress;
- verified date and official source;
- tax applicability;
- data retention and commercial-use restrictions.

## Scenario table

Claude must calculate low/base/high cases for 1, 10, 30 and 100 hours per paid user per month. Until official rates are entered, use symbolic variables or clearly labeled assumptions. Never repeat an earlier `$0.01/minute` hypothesis as a fact.

## Provisional packaging hypothesis

These are experimentation starting points, not commitments:

| Plan | Candidate price | Included voice | Text | Route |
|---|---:|---:|---|---|
| Free | $0 | 30–60 min/month | capped | economical only |
| Connect | $7.99 | 3–5 h/month | generous | economical |
| Close | $14.99 | 12–20 h/month | generous | economical + limited premium |
| Always | $24.99 | 35–50 h/month | generous | best-value routing + premium allowance |

Do not publicly promise these hour allowances until the benchmark produces an observed blended cost per hour and the p95 user remains profitable after store fees.

Annual plans should not launch until retention, refunds and actual heavy-user cost are understood.

## Fair-use controls

- visible meter and forecast before cap;
- graceful switch from premium to economical route where disclosed;
- optional minute add-ons;
- hard maximum session duration with easy restart;
- idle/listening timeout;
- abuse and automation detection;
- monthly spend circuit breaker;
- no surprise overage charges.

Do not advertise “unlimited” unless the legal terms, capacity and economics genuinely support it.

## Margin gates

Before public launch, model:

- gross margin at median, p75, p90, p95 and p99 usage;
- Apple/Google fee scenarios;
- monthly vs annual mix;
- free-user subsidy;
- provider outage fallback cost;
- refund and chargeback rates;
- customer support allocation.

Recommended initial gate: base-case contribution margin should remain positive at p95 paid usage, with an emergency remote-config route/cap available.

## Experiments

1. Measure willingness to pay for hours, not vague “credits.”
2. Compare push-to-talk with hands-free for cost and retention.
3. Test whether users value premium voice quality or more minutes.
4. Offer a transparent cheaper voice mode.
5. Test add-on hour bundles before raising subscription prices.
