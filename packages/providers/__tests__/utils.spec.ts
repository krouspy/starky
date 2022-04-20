import { isCallContractPayload } from '../src/utils';
import type { CallContractPayload } from '../src/types';

describe('provider.utils', () => {
  describe('isCallContractPayload()', () => {
    test('isCallContractPayload(payload)', () => {
      const payload: CallContractPayload = {
        contract_address: 'address',
        entry_point_selector: 'entry_point',
        signature: ['signature'],
        calldata: ['calldata'],
      };
      expect(isCallContractPayload(payload)).toBeTruthy();
    });

    test('throw isCallContractPayload(payload)', () => {
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
      expect(isCallContractPayload(payload1)).toBeFalsy();
      expect(isCallContractPayload(payload2)).toBeFalsy();
      expect(isCallContractPayload(payload3)).toBeFalsy();
      expect(isCallContractPayload(payload4)).toBeFalsy();
    });
  });
});
