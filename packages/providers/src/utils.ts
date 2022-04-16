import { BigNumber } from '@ethersproject/bignumber';

export const isPositiveInteger = (num: number) => num >= 0 && Number.isInteger(num);
/**
 * TODO: check correctness of the address
 *
 * Currently only check if the string starts with `0x`, we need an extended verification
 * @param s String
 * @returns true if `s` is a correct hex address or false if not
 */
const isHexAddress = (s: string) => s.startsWith('0x');

/**
 * @param address String
 * @returns The address in hex format
 */
export const getHexAddress = (address: string) =>
  isHexAddress(address) ? address : BigNumber.from(address).toHexString();
