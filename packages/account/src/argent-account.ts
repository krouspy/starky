import { Provider } from '@starkyproject/providers';
import { Signer } from '@starkyproject/signer';
import { BaseAccount } from './base-account';
import { abi } from './abis/ArgentAccount.json';

export class ArgentAccount extends BaseAccount {
  constructor(signer: Signer, provider: Provider) {
    super(signer, abi, provider);
  }

  static create(provider: Provider) {
    const signer = Signer.create();
    return new ArgentAccount(signer, provider);
  }
}
