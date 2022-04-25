import { Provider } from '@starky/providers';
import { ContractFactory, Contract } from '../src';
import ERC20 from '../src/abis/ERC20.json';

const provider = new Provider('goerli');

describe('ContractFactory', () => {
  it('should deploy a contract', async () => {
    const factory = new ContractFactory(provider);
    const contract = await factory.deploy({
      abi: ERC20.abi,
      entry_points_by_type: ERC20.entry_points_by_type,
      program: ERC20.program,
    });
    expect(contract).toBeInstanceOf(Contract);
  });
});
