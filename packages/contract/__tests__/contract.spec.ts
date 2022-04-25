import { Provider } from '@starky/providers';
import { Contract } from '../src';
import ERC20 from '../src/abis/ERC20.json';

const provider = new Provider('goerli');
const address = '0x3dea0354b74919d6bfa073a72de25a72bf795b592f86c33172ee0ed60f523e1';

describe('Contract', () => {
  it('should call contract function', async () => {
    const contract = new Contract(address, ERC20.abi, provider);
    const result = await contract.call({
      functionName: 'get_total_supply',
    });
    expect(typeof result).toBe('string');
  });
});
