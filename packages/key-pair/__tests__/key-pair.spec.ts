import { createStarkPrivateKey, getPublicKeyFromPrivateKey, createStarkKeys } from '../src';

describe('key-pair', () => {
  it('generateRandomStarkPrivateKey()', () => {
    const privateKey = createStarkPrivateKey();
    expect(typeof privateKey).toBe('string');
    expect(privateKey.length).toBe(66);
    expect(privateKey.startsWith('0x')).toBe(true);
  });

  it('createStarkKeyFromPrivateKey(privateKey)', () => {
    const privateKey = createStarkPrivateKey();
    const starkKey = getPublicKeyFromPrivateKey(privateKey);
    expect(typeof starkKey).toBe('string');
  });

  it('createStarkKeys()', () => {
    const { privateKey, publicKey, keyPair } = createStarkKeys();
    expect(typeof privateKey).toBe('string');
    expect(typeof publicKey).toBe('string');
    expect(typeof keyPair).toBe('object');
  });
});
