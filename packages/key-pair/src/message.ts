import type { ECKeyPair } from './elliptic';

/*
 The function _truncateToN in lib/elliptic/ec/index.js does a shift-right of 4 bits
 in some cases. This function does the opposite operation so that
   _truncateToN(fixMessage(msg)) == msg.
*/
function fixMessage(msg: string) {
  const pureHex = msg.replace(/^0x0*/, '');
  if (pureHex.length <= 62) {
    // In this case, pureHex should not be transformed, as the byteLength() is at most 31,
    // so delta < 0 (see _truncateToN).
    return pureHex;
  }
  // In this case delta will be 4 so we perform a shift-left of 4 bits by adding a ZERO_BN.
  return `${pureHex}0`;
}

/*
 Signs a message using the provided key.
 key should be a KeyPair with a valid private key.
 Returns a Signature.
*/
export function sign(keyPair: ECKeyPair, messageHash: string): string[] {
  const msgSignature = keyPair.sign(fixMessage(messageHash));
  const { r, s } = msgSignature;
  return [r.toString(), s.toString()];
}
