# RemitLastMile API

A NestJS REST layer over the RemitLastMile Soroban contract.

## ⚠️ Before you use this for anything real

Testnet demo scaffold. `register_agent` has no bonding or verification
yet (see `docs/adr/001-agent-trust-and-bonding.md` in the repo root) —
don't treat any registered agent as trustworthy in this version. Also,
`create_cashout_request` and `claim_cashout` are signed with this
service's shared key rather than the sender's/agent's own wallet, which
only works for demos. Both are tracked in `ISSUES.md`.

## Setup

```bash
cd api
npm install
cp .env.example .env
npm run start:dev
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/agents` | Register as a cash-out agent. Body: `{ agentAddress, name, location }` |
| `GET` | `/agents/:address/registered` | Check if an address is a registered agent |
| `POST` | `/cashouts` | Create a cash-out request. Body: `{ senderAddress, tokenContractId, amount, secret }` — the API hashes `secret` before it touches the contract |
| `GET` | `/cashouts/:id` | Fetch a cash-out request's state |
| `POST` | `/cashouts/:id/claim` | Agent claims a request. Body: `{ agentAddress, secret }` |

## A note on the secret

The `secret` field is a plaintext string chosen by whoever creates the
cash-out request (e.g. a 6-digit PIN). Share it with the intended
recipient out-of-band — SMS, WhatsApp, in person. The API hashes it with
SHA-256 before the contract ever sees it at creation time; the contract
only sees the plaintext at claim time, when an agent submits it.

## Generating a testnet service account

```bash
node -e "console.log(require('@stellar/stellar-sdk').Keypair.random().secret())"
```

Fund it via [Friendbot](https://friendbot.stellar.org) before use.
