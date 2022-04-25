import { Provider } from '@starky/providers';
import type { CallContract } from '@starky/providers';
import type { Abi } from './types';

type CallParameters = Omit<CallContract, 'contractAddress'>;

export class Contract {
  constructor(
    public readonly address: string,
    public readonly abi: Abi,
    private readonly _provider: Provider
  ) {}

  async call(params: CallParameters) {
    const { result } = await this._provider.callContract({
      contractAddress: this.address,
      ...params,
    });
    return result[0];
  }
}
