import { BigNumber } from '@ethersproject/bignumber';
import { CallContractPayloadSchema } from './schemas/payloads';
import type { Operation, PostOperation, CallContractPayload } from './types';

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

export function isCallContractPayload(payload: unknown): payload is CallContractPayload {
  const { success } = CallContractPayloadSchema.safeParse(payload);
  return success;
}

export function isPostOperation(s: Operation): s is PostOperation {
  const postOperations: PostOperation[] = ['deploy_contract', 'get_nonce'];
  return postOperations.includes(s as PostOperation);
}
