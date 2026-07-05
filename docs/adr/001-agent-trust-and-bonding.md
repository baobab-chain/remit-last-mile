# ADR 001: Open agent registration for now, bonding planned as v2

## Status
Accepted (temporary — revisit before any real-money use)

## Context
`register_agent` currently lets any address register as a cash-out
agent with no stake, deposit, or verification. Combined with the
hash-locked claim system, this creates a real risk: if a secret leaks
(intercepted in transit, guessed, or the recipient is tricked into
sharing it with the wrong person), any registered "agent" can claim the
funds with no consequence for never paying out cash.

## Decision
Ship the MVP with open registration for testnet development, but treat
agent bonding as the top-priority pre-production issue. Options to
evaluate (not yet decided):
- Require agents to stake a bond (e.g. in the same token they'll be
  claiming) that can be slashed if a recipient disputes non-payment
- Layer in a reputation score based on completed claims with no disputes
- Require an off-chain KYC/verification step before an agent can register, attested on-chain by a trusted issuer

## Consequences
- Anyone testing/contributing right now can register as an agent — expected and fine for testnet
- This contract must not be used for real remittances until a bonding or verification mechanism exists
- Every README/API doc references this limitation explicitly
