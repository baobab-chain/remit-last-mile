# Architecture

## Core concepts

**Agent** — an address registered to act as a cash-out point. Currently
self-registered with no verification (see ADR 001 — this is the top
priority gap).

**CashoutRequest** — an escrowed amount created by a sender, locked
behind a hashed secret code. The plaintext secret is shared with the
intended recipient out-of-band (SMS, WhatsApp, in person) — it never
touches the chain until claim time.

## Contract lifecycle (current skeleton)

1. `register_agent(agent, name, location)` — anyone can register as an agent.
2. `create_cashout_request(sender, token, amount, secret_hash)` — sender
   deposits funds into the contract, providing a SHA-256 hash of a secret
   code. Returns a `request_id`.
3. `claim_cashout(agent, request_id, secret)` — an agent who has been told
   the plaintext secret by the recipient submits it. If `sha256(secret)`
   matches the stored hash, the escrowed amount transfers to the agent,
   and the request is marked claimed.

The assumption is: the agent only learns the secret because the recipient
physically showed up and asked for their cash, so the agent fronting cash
before or immediately after claiming is a reasonable real-world flow.

## Known gaps (help wanted)

- **No agent bonding or reputation.** This is the single most important
  gap — see `docs/adr/001-agent-trust-and-bonding.md`. Right now nothing
  stops a bad actor from registering as an agent, learning a secret some
  other way, and claiming funds without ever paying a recipient.
- **No refund path.** If a cash-out request is never claimed (recipient
  never shows up, secret is lost), the sender's funds are stuck in the
  contract forever. Needs an expiry + refund mechanism.
- **No dispute resolution.** If a recipient claims an agent took their
  code but never paid them cash, there's no on-chain mechanism to
  arbitrate — this is currently a pure off-chain trust problem.
- **No agent discovery layer on-chain.** Matching a recipient to a nearby
  agent (location-based matching) is assumed to happen off-chain (e.g. in
  the API/app layer), not in the contract.
- **No audit.** Do not use this contract to hold real remittance funds
  until it has had a security review.

## Why hash-locked secrets instead of a name-matching claim

A simple "recipient's name matches" claim system is trivially spoofable.
A hash-locked secret, shared out-of-band, means only someone who actually
received the code from the sender/recipient chain can claim — closer to
how a physical pickup-code remittance service (e.g. a PIN-based cash
transfer) already works, just enforced by a contract instead of a
company's internal system.
