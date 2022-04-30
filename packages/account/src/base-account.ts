import { Provider, type Abi } from '@starkyproject/providers';
import { Signer } from '@starkyproject/signer';

export const chainId = {
  mainnet: '0x534e5f4d41494e',
  testnet: '0x534e5f474f45524c49',
};

export abstract class BaseAccount {
  constructor(
    protected readonly signer: Signer,
    protected readonly abi: Abi,
    protected readonly provider: Provider
  ) {}

  public async getNonce() {
    return this.provider.getNonce(this.signer.publicKey);
  }

  public async estimateFee() {
    const nonce = await this.getNonce();
    const details = {
      walletAddress: this.signer.publicKey,
      maxFee: 0,
      nonce,
      chainId: chainId.testnet,
    };
  }
}
