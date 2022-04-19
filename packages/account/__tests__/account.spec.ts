import { Provider } from '@starky/providers';
import { Account } from '../src';

const provider = new Provider('goerli');
const account = new Account(provider, 'address');

describe('account', () => {
  it('needs tests', () => {
    console.log(account.address);
    expect(true).toBeTruthy();
  });
});
