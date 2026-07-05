# RemitLastMile

**A cash-out agent network for Stellar-settled remittances.**

---

## The problem

Stellar can settle a cross-border payment in seconds for a fraction of a
cent. But a diaspora worker sending money home to a relative in Nigeria
often isn't solving a settlement problem — they're solving a **cash
problem**. The recipient needs physical Naira in hand, and most existing
Stellar-based tools stop at "the money arrived on-chain," leaving the
actual last mile — turning that balance into cash at a real location —
unsolved.

RemitLastMile is the missing layer: an on-chain claim-code system plus an
agent network, so a sender's Stellar payment becomes cash a recipient can
collect from a real person nearby.

## What this is

1. **Sender creates a cash-out request** — deposits funds into escrow
   along with a hashed secret code (a PIN, shared with the recipient
   out-of-band via SMS/WhatsApp).
2. **Recipient goes to any registered agent** (a market trader, a kiosk,
   anyone who's registered as a liquidity agent) and gives them the code.
3. **Agent fronts the cash** to the recipient, then submits the code
   on-chain to claim the escrowed funds for themselves.

No bank branch, no remittance company counter — any registered agent
with cash on hand can serve as a pickup point.

## Why Stellar / Soroban

- **Escrow enforced by the contract**, not held by a remittance company or a single agent
- **Any USDC/XLM holder can become an agent** — no licensing or corridor agreements required to bootstrap liquidity
- **Settlement in seconds** means an agent can be confident the claim is real before handing over cash

## Status

Early-stage / MVP skeleton. Not audited. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and
[`docs/adr/001-agent-trust-and-bonding.md`](docs/adr/001-agent-trust-and-bonding.md)
for the current design and, importantly, **the biggest open risk**: agent
registration is currently open with no bonding or reputation, which means
nothing stops a bad actor from registering, intercepting a claim, and
never paying the recipient. This is the top-priority issue — see
[`ISSUES.md`](ISSUES.md).

## Repo layout

- **`contracts/remit-last-mile/`** — the Soroban smart contract (Rust)
- **`api/`** — a NestJS REST layer over the contract
- **`web/`** — static landing page explaining the protocol

## Getting started

**Contract:**
```bash
cd contracts/remit-last-mile
cargo build --target wasm32-unknown-unknown --release
cargo test
```

**API:**
```bash
cd api
npm install
cp .env.example .env
npm run start:dev
```

**Landing page:**
```bash
cd web
python3 -m http.server 8082
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to contribute.

## License

MIT — see [`LICENSE`](LICENSE).
