// Reveals the masked voucher code, character by character, to depict
// the moment a recipient shares their pickup code with an agent. The
// REDEEMED stamp (pure CSS, see styles.css) fires shortly after.

const CODE = '482913';
const codeEl = document.getElementById('voucher-code');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function revealCode() {
  if (prefersReducedMotion) {
    codeEl.textContent = CODE;
    return;
  }

  let revealed = 0;
  const interval = setInterval(() => {
    revealed += 1;
    const shown = CODE.slice(0, revealed);
    const hidden = '•'.repeat(CODE.length - revealed);
    codeEl.textContent = shown + hidden;
    if (revealed >= CODE.length) clearInterval(interval);
  }, 220);
}

// Start shortly after load so the eye lands on the card first.
setTimeout(revealCode, 500);
