## 1. Agent bonding/staking mechanism (top priority)

**Labels:** `complexity: high`, `contract-logic`, `help wanted`, `priority: high`

Per `docs/adr/001-agent-trust-and-bonding.md`, agent registration is
currently open with no stake or verification — the single most important
gap before this protocol could handle real remittances.

**Acceptance criteria:**
- Design proposal posted as a comment on this issue before implementation
- `register_agent` requires locking a bond in a specified token
- A dispute mechanism that can slash the bond (even a simple admin-arbitrated version for v1 is fine — full decentralized arbitration can be a later issue)
- Tests covering bonding, successful unbonding, and slashing

---

## 2. Refund path for unclaimed cash-out requests

**Labels:** `complexity: medium`, `contract-logic`

If a recipient never shows up to claim, the sender's funds are currently
stuck in the contract forever.

**Acceptance criteria:**
- Add an expiry ledger to `CashoutRequest`
- New `refund(sender, request_id)` function that returns funds to the sender if unclaimed past expiry
- Tests covering refund before/after expiry, and refund attempts on already-claimed requests

---

## 3. Tests for rejected paths

**Labels:** `good-first-issue`, `complexity: trivial`, `tests`

**Acceptance criteria:**
- Test `claim_cashout` fails with `InvalidSecret` given the wrong secret
- Test `claim_cashout` fails with `AlreadyClaimed` on a second claim attempt
- Test `claim_cashout` fails with `AgentNotRegistered` for an unregistered address

---

## 4. Agent reputation / dispute reporting

**Labels:** `complexity: high`, `contract-logic`, `discussion`

Senders and recipients need a way to know which agents are reliable.

**Acceptance criteria:**
- Design discussion posted first
- Some on-chain record of completed claims per agent, and a way for a recipient to flag a dispute (didn't receive cash)
- Decide how disputes affect an agent's ability to register/claim in future (ties into issue #1's bonding mechanism)

---

## 5. Minimal CLI/script for a full testnet cash-out cycle

**Labels:** `good-first-issue`, `complexity: trivial`, `tooling`

**Acceptance criteria:**
- Script in `scripts/` that registers a test agent, creates a cash-out request, and claims it with the correct secret on testnet
- Documented in `docs/` with exact commands
- README updated to link to it under "Getting started"

---

## 6. Off-chain agent discovery / location matching design

**Labels:** `complexity: medium`, `discussion`, `api`

The contract has no concept of "nearest agent" — that's assumed to live
in the API/app layer. We need a design for how a recipient finds a
nearby registered agent.

**Acceptance criteria:**
- Proposal for how agent location data (currently a free-text `Symbol` on-chain) maps to something queryable (e.g. an off-chain index synced from on-chain events)
- No contract changes required unless the proposal identifies a real need
