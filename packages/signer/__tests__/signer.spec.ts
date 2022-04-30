import { KeyPair } from '@starkyproject/key-pair';
import { Signer } from '../src';

describe('Signer', () => {
  it('should create a Signer instance from a private key', () => {
    const privateKey = KeyPair.createStarkPrivateKey();
    const signer = new Signer(privateKey);
    expect(signer).toBeInstanceOf(Signer);
    expect(signer.privateKey).toBe(privateKey);
    expect(signer.publicKey).toBe(KeyPair.getPublicKeyFromPrivateKey(privateKey));
  });

  it('should create a new Signer instance', () => {
    const signer = Signer.create();
    expect(signer).toBeInstanceOf(Signer);
  });
});
