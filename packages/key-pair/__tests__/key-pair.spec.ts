import { KeyPair } from '../src';

describe('KeyPair', () => {
  it('generateRandomStarkPrivateKey()', () => {
    const privateKey = KeyPair.createStarkPrivateKey();
    expect(typeof privateKey).toBe('string');
    expect(privateKey.length).toBe(66);
    expect(privateKey.startsWith('0x')).toBe(true);
  });

  it('createStarkKeyFromPrivateKey(privateKey)', () => {
    const privateKey = KeyPair.createStarkPrivateKey();
    const starkKey = KeyPair.getPublicKeyFromPrivateKey(privateKey);
    expect(typeof starkKey).toBe('string');
  });

  it('createStarkKeys()', () => {
    const { privateKey, publicKey, keyPair } = KeyPair.createStarkKeys();
    expect(typeof privateKey).toBe('string');
    expect(typeof publicKey).toBe('string');
    expect(typeof keyPair).toBe('object');
  });
});
