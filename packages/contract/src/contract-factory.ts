import { Provider } from '@starkyproject/providers';
import type { Abi, ContractDefinition } from '@starkyproject/providers';
import { Signer } from '@starkyproject/signer';
import { compressProgram } from '@starkyproject/utils';
import { Contract } from './contract';

type Definition = Pick<ContractDefinition, 'abi' | 'entry_points_by_type'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  program: Record<any, any>;
};

export class ContractFactory {
  constructor(
    private readonly _abi: Abi,
    private readonly _provider: Provider,
    private _signer?: Signer
  ) {}

  connect(signer: Signer) {
    this._signer = signer;
    return this;
  }

  attach(contractAddress: string) {
    return new Contract(contractAddress, this._abi, this._provider);
  }

  async deploy({ abi, entry_points_by_type, program }: Definition): Promise<Contract> {
    if (this._signer === undefined) throw new Error('ContractFactory: signer is required');
    const { publicKey } = this._signer;
    const contractDefinition: ContractDefinition = {
      abi,
      entry_points_by_type,
      program: compressProgram(program),
    };
    const { address } = await this._provider.deployContract(publicKey, contractDefinition);
    return new Contract(address, abi, this._provider, this._signer);
  }
}
