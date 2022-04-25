import { getSelectorFromName } from '../src';

const depositSelector = {
  hex: '0xc73f681176fc7b3f9693986fd7b14581e8d540519e27400e88b8713932be01',
  int: '352040181584456735608515580760888541466059565068553383579463728554843487745',
};

describe('Selector', () => {
  it("getSelectorFromName('deposit')", () => {
    const selector = getSelectorFromName('deposit');
    expect(selector.hex).toBe(depositSelector.hex);
    expect(selector.int).toBe(depositSelector.int);
  });

  it('getSelectorFromName(__default__)', () => {
    const selector = getSelectorFromName('__default__');
    expect(selector.hex).toBe('0');
    expect(selector.int).toBe('0');
  });

  it('getSelectorFromName(__l1_default__)', () => {
    const selector = getSelectorFromName('__l1_default__');
    expect(selector.hex).toBe('0');
    expect(selector.int).toBe('0');
  });
});
