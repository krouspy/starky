import { BigNumber } from '@ethersproject/bignumber';
import { keccak_256 } from 'js-sha3';
import { isDefaultEntryPoint } from './types';
import type { Selector } from './types';

const DEFAULT_ENTRY_POINT_SELECTOR = 0;
const MASK_250 = BigNumber.from(2).pow(250).sub(1);

export function getSelectorFromName(name: string): Selector {
  if (isDefaultEntryPoint(name)) {
    return {
      hex: DEFAULT_ENTRY_POINT_SELECTOR.toString(),
      int: DEFAULT_ENTRY_POINT_SELECTOR.toString(),
    };
  }
  const selector = BigNumber.from(`0x${keccak_256(name)}`).and(MASK_250);
  return { hex: selector.toHexString(), int: selector.toString() };
}
