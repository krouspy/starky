import type { ContractInteraction, Abi } from '@starkyproject/providers';
import { Provider } from '@starkyproject/providers';
import { Signer } from '@starkyproject/signer';

type InteractionParameters = Omit<ContractInteraction, 'contractAddress'>;

export class Contract {
  constructor(
    private _address: string,
    public readonly abi: Abi,
    private readonly _provider: Provider,
    public signer?: Signer
  ) {}

  attach(address: string) {
    this._address = address;
  }

  connect(signer: Signer) {
    this.signer = signer;
    return this;
  }

  async call(params: InteractionParameters) {
    const result = await this._provider.callContract({
      contractAddress: this._address,
      ...params,
    });
    return result[0];
  }

  async invoke(params: InteractionParameters) {
    return this._provider.invokeContract({
      contractAddress: this._address,
      ...params,
    });
  }
}
