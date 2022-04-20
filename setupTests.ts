import {
  BlockHashSchema,
  TransactionHashSchema,
  GetBlockSchema,
  GetTransactionSchema,
  GetTransactionStatusSchema,
  GetTransactionReceiptSchema,
  GetContractCodeSchema,
  GetContractAddressesSchema,
  GetNonceSchema,
} from './packages/providers/src/schemas/responses';
import type {
  GetBlockResponse,
  GetTransactionResponse,
  GetTransactionStatusResponse,
  GetTransactionReceiptResponse,
  GetContractCodeResponse,
  GetContractAddressesResponse,
  GetNonceResponse,
} from './packages/providers/src/types/responses';

interface CustomMatchers<R = unknown> {
  toBeBlock(): R;
  toBeBlockHash(): R;
  toBeTransaction(): R;
  toBeTransactionStatus(): R;
  toBeTransactionReceipt(): R;
  toBeTransactionHash(): R;
  toBeContractCode(): R;
  toBeContractAddresses(): R;
  toBeNonce(): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

expect.extend({
  toBeBlock(received: GetBlockResponse) {
    GetBlockSchema.parse(received);
    return {
      message: () => 'Block parsing success',
      pass: true,
    };
  },
  toBeBlockHash(received: string) {
    BlockHashSchema.parse(received);
    return {
      message: () => 'BlockHash parsing success',
      pass: true,
    };
  },
  toBeTransaction(received: GetTransactionResponse) {
    GetTransactionSchema.parse(received);
    return {
      message: () => 'Transaction parsing success',
      pass: true,
    };
  },
  toBeTransactionStatus(received: GetTransactionStatusResponse) {
    GetTransactionStatusSchema.parse(received);
    return {
      message: () => 'TransactionStatus parsing success',
      pass: true,
    };
  },
  toBeTransactionReceipt(received: GetTransactionReceiptResponse) {
    GetTransactionReceiptSchema.parse(received);
    return {
      message: () => 'TransactionReceipt parsing success',
      pass: true,
    };
  },
  toBeTransactionHash(received: string) {
    TransactionHashSchema.parse(received);
    return {
      message: () => 'TransactionHash parsing success',
      pass: true,
    };
  },
  toBeContractCode(received: GetContractCodeResponse) {
    GetContractCodeSchema.parse(received);
    return {
      message: () => 'ContractCode parsing success',
      pass: true,
    };
  },
  toBeContractAddresses(received: GetContractAddressesResponse) {
    GetContractAddressesSchema.parse(received);
    return {
      message: () => 'ContractAddresses parsing success',
      pass: true,
    };
  },
  toBeNonce(received: GetNonceResponse) {
    GetNonceSchema.parse(received);
    return {
      message: () => 'GetNonce parsing success',
      pass: true,
    };
  },
});
