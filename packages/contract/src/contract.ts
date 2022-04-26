import { Provider } from '@starky/providers';
import type { ContractInteraction } from '@starky/providers';
import type { Abi } from './types';

type InteractionParameters = Omit<ContractInteraction, 'contractAddress'>;

export class Contract {
  constructor(
    public readonly address: string,
    public readonly abi: Abi,
    private readonly _provider: Provider
  ) {}

  async call(params: InteractionParameters) {
    const result = await this._provider.callContract({
      contractAddress: this.address,
      ...params,
    });
    return result[0];
  }

  async invoke(params: InteractionParameters) {
    return this._provider.invokeContract({
      contractAddress: this.address,
      ...params,
    });
  }
}
