import { Provider } from '@starky/providers';

export class Account {
  private readonly _provider: Provider;

  public readonly address: string;

  constructor(provider: Provider, address: string) {
    this._provider = provider;
    this.address = address;
  }

  async getNonce() {
    return this._provider.getNonce(this.address);
  }
}
