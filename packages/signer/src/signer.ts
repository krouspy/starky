import { KeyPair, type ECKeyPair } from '@starkyproject/key-pair';

export class Signer {
  public readonly publicKey: string;
  public readonly keyPair: ECKeyPair;

  constructor(public readonly privateKey: string) {
    this.publicKey = KeyPair.getPublicKeyFromPrivateKey(privateKey);
    this.keyPair = KeyPair.getKeyPairFromPrivateKey(privateKey);
  }

  /**
   * Create a Signer instance with a newly generated private key
   * @returns Signer instance
   */
  static create() {
    const privateKey = KeyPair.createStarkPrivateKey();
    return new Signer(privateKey);
  }

  signTransaction() {}
}
