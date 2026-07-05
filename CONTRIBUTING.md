# Contributing to RemitLastMile

Thanks for considering contributing. This project is part of the Stellar
Wave Program, so contributions here can count toward Wave rewards — but
we care about code quality first.

## Before you start

1. Check open issues for one tagged `good-first-issue` if this is your first contribution here.
2. Comment on the issue to claim it before starting work.
3. Want to propose something not covered by an existing issue? Open a new issue first to discuss scope.

## Issue complexity labels

- `complexity: trivial` — docs, small fixes, config, no contract logic changes
- `complexity: medium` — a contract function, a test suite, a well-scoped feature
- `complexity: high` — cross-cutting changes, new modules, anything touching escrow, claims, or agent trust logic

## Development setup

```bash
git clone https://github.com/baobab-labs/remit-last-mile.git
cd remit-last-mile/contracts/remit-last-mile
cargo build --target wasm32-unknown-unknown --release
cargo test
```

## Pull requests

- Keep PRs scoped to one issue
- Include or update tests for any contract logic change
- Describe what you tested manually and how
- Escrow, claim, and agent-trust logic needs at least one other reviewer's approval before merge, no exceptions

## Code of conduct

Be respectful. This project touches real people's remittance money on
both ends of the transaction — treat contributions and reviews with the
seriousness that implies.
