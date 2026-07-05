# RemitLastMile — Landing Page

A static landing page explaining the protocol. No build step required.

## Run locally

```bash
cd web
python3 -m http.server 8082
```

Or open `index.html` directly in a browser.

## Design notes

- The hero visual is a cash-out voucher: the code masks-then-reveals
  (JS-driven, respects `prefers-reduced-motion`) and a "REDEEMED" stamp
  fires shortly after — depicting the actual claim mechanism, not
  generic remittance iconography.
- Gold is the primary action color here (vs. terracotta in
  diaspora-circle, green in farmchain-receipts) — same Baobab Labs
  palette across all repos, different primary accent per repo so they're
  distinguishable at a glance.
- No frameworks or build tooling — deploy directly via GitHub Pages,
  Netlify, or any static host.
