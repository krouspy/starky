import { Provider } from '@starky/providers';
import { Account } from '../src';

const address = '0x6965c8a5318fbd638949888fabbd54e247897dcd696f1b6e31db04485fa1277';

const provider = new Provider('goerli');
const account = new Account(provider, address);

describe('account', () => {
  it('account.getNonce()', async () => {
    const nonce = await account.getNonce();
    expect(typeof nonce).toBe('string');
  });
});
