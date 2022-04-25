import { Provider } from '@starky/providers';
import type { ContractDefinition } from '@starky/providers';
import { createStarkKeys } from '@starky/key-pair';
import { compressProgram } from '@starky/utils';
import { Contract } from './contract';

type Definition = Pick<ContractDefinition, 'abi' | 'entry_points_by_type'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  program: Record<any, any>;
};

export class ContractFactory {
  constructor(private readonly _provider: Provider) {}

  async deploy({ abi, entry_points_by_type, program }: Definition): Promise<Contract> {
    const { publicKey } = createStarkKeys();
    const contractDefinition: ContractDefinition = {
      abi,
      entry_points_by_type,
      program: compressProgram(program),
    };
    const { address } = await this._provider.deployContract(publicKey, contractDefinition);
    return new Contract(address, abi, this._provider);
  }
}
