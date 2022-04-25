import { Provider } from '@starky/providers';
import { KeyPair } from '@starky/key-pair';
import { BaseAccount } from './base-account';

export class ArgentAccount extends BaseAccount {
  constructor(privateKey: string, publicKey: string, keyPair: KeyPair, provider: Provider) {
    super(privateKey, publicKey, keyPair, provider);
  }
}
