import { Provider } from '@starkyproject/providers';
import { KeyPair } from '@starkyproject/key-pair';
import { BaseAccount } from './base-account';

export class ArgentAccount extends BaseAccount {
  constructor(privateKey: string, publicKey: string, keyPair: KeyPair, provider: Provider) {
    super(privateKey, publicKey, keyPair, provider);
  }
}
