import { createHash } from 'node:crypto';

/**
 * Hashes a plaintext secret code the same way the contract does
 * (SHA-256), so the API can compute `secret_hash` when creating a
 * cash-out request without ever needing the contract to see the
 * plaintext until claim time.
 */
export function sha256Hex(plaintext: string): Buffer {
  return createHash('sha256').update(plaintext, 'utf8').digest();
}
