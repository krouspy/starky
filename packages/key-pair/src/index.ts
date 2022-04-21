import { BigNumber } from '@ethersproject/bignumber';
import { addHexPrefix, removeHexPrefix } from '@starky/utils';
import { ec } from './elliptic';
import { sanitizeBytes } from './encode';

/**
 * Create a stark private key in hex format
 * @param [length=63] - The length of the private key. Defaults to 63. Note that '0x0' is added to the result
 * @returns The generated stark private key in hex string
 */
export function createStarkPrivateKey(length = 63) {
  const characters = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < length; ++i) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return BigNumber.from(addHexPrefix(result)).toHexString();
}

function getKeyPairFromPrivateKey(privateKeyHex: string) {
  return ec.keyFromPrivate(removeHexPrefix(privateKeyHex), 'hex');
}

function getPublicKey(privateKeyHex: string) {
  const keyPair = getKeyPairFromPrivateKey(privateKeyHex);
  // generate the .pub property used below
  keyPair.getPublic(true, 'hex');
  return addHexPrefix(sanitizeBytes((keyPair as any).pub.getX().toString(16), 2));
}

export function getPublicKeyFromPrivateKey(privateKeyHex: string) {
  return getPublicKey(privateKeyHex);
}

/**
 * Create stark private and public keys
 * @returns An object containing the private and public keys
 */
export function createStarkKeys() {
  const privateKey = createStarkPrivateKey();
  const publicKey = getPublicKeyFromPrivateKey(privateKey);
  return { privateKey, publicKey };
}
