import { isPositiveInteger, isCallContractPayload } from '../src/utils';
import type { CallContractPayload } from '../src/types';

describe('provider.utils', () => {
  describe('isPositiveInteger()', () => {
    it('isPositiveInteger(10) -> true', () => {
      expect(isPositiveInteger(10)).toBe(true);
    });

    it('isPositiveInteger(1.5) -> false', () => {
      expect(isPositiveInteger(1.5)).toBe(false);
    });

    it('isPositiveInteger(-2) -> false', () => {
      expect(isPositiveInteger(-2)).toBe(false);
    });
  });

  describe('isCallContractPayload()', () => {
    it('isCallContractPayload(payload) -> true', () => {
      const payload: CallContractPayload = {
        contract_address: 'address',
        entry_point_selector: 'entry_point',
        signature: ['signature'],
        calldata: ['calldata'],
      };
      expect(isCallContractPayload(payload)).toBe(true);
    });

    it('isCallContractPayload(payload) -> false', () => {
      const payload1: Partial<CallContractPayload> = {
        contract_address: 'address',
        entry_point_selector: 'entry_point',
        signature: ['signature'],
      };
      const payload2: Partial<CallContractPayload> = {
        contract_address: 'address',
        entry_point_selector: 'entry_point',
        calldata: ['calldata'],
      };
      const payload3: Partial<CallContractPayload> = {
        contract_address: 'address',
        signature: ['signature'],
        calldata: ['calldata'],
      };
      const payload4: Partial<CallContractPayload> = {
        entry_point_selector: 'entry_point_selector',
        signature: ['signature'],
        calldata: ['calldata'],
      };
      expect(isCallContractPayload(payload1)).toBe(false);
      expect(isCallContractPayload(payload2)).toBe(false);
      expect(isCallContractPayload(payload3)).toBe(false);
      expect(isCallContractPayload(payload4)).toBe(false);
    });
  });
});
