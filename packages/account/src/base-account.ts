import { Provider } from '@starky/providers';
import { KeyPair } from '@starky/key-pair';

export abstract class BaseAccount {
  constructor(
    public readonly privateKey: string,
    public readonly publicKey: string,
    public readonly keyPair: KeyPair,
    protected readonly provider: Provider
  ) {}

  async getNonce() {
    return this.provider.getNonce(this.privateKey);
  }
}
