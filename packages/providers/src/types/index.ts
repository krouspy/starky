import type {
  GetBlockResponse,
  GetBlockHashByIdResponse,
  GetTransactionResponse,
  GetTransactionStatusResponse,
  GetTransactionReceiptResponse,
  GetTransactionHashByIdResponse,
  GetContractCodeResponse,
  GetContractAddressesResponse,
  ReadContractResponse,
} from './responses';
import type { UnionToTuple } from './utils';

export type Network = 'mainnet' | 'goerli';
export type Gateway = 'gateway' | 'feeder_gateway';

export type ReadOperations =
  | {
      operation: 'get_block_by_number';
      endpoint: 'get_block';
      payload: { blockNumber: number };
      result: GetBlockResponse;
    }
  | {
      operation: 'get_block_by_hash';
      endpoint: 'get_block';
      payload: { blockHash: string };
      result: GetBlockResponse;
    }
  | {
      operation: 'get_latest_block';
      endpoint: 'get_block';
      result: GetBlockResponse;
    }
  | {
      operation: 'get_block_hash_by_id';
      payload: { blockId: number };
      result: GetBlockHashByIdResponse;
    }
  | {
      operation: 'get_block_id_by_hash';
      payload: { blockHash: string };
      result: number;
    }
  | {
      operation: 'get_transaction_by_hash';
      endpoint: 'get_transaction';
      payload: { transactionHash: string };
      result: GetTransactionResponse;
    }
  | {
      operation: 'get_transaction_status';
      payload: { transactionHash: string };
      result: GetTransactionStatusResponse;
    }
  | {
      operation: 'get_transaction_receipt';
      payload: { transactionHash: string };
      result: GetTransactionReceiptResponse;
    }
  | {
      operation: 'get_transaction_hash_by_id';
      payload: { transactionId: number };
      result: GetTransactionHashByIdResponse;
    }
  | {
      operation: 'get_transaction_id_by_hash';
      payload: { transactionHash: string };
      result: number;
    }
  | {
      operation: 'get_code';
      payload: { contractAddress: string };
      result: GetContractCodeResponse;
    }
  | {
      operation: 'get_contract_addresses';
      result: GetContractAddressesResponse;
    }
  | {
      operation: 'get_storage_at';
      payload: { contractAddress: string; key: number };
      result: string;
    };

type WriteOperations =
  | {
      operation: 'add_transaction';
      payload: { transactionHash: string };
      result: GetTransactionResponse;
    }
  | {
      operation: 'call_contract';
      payload: { contractAddress: string; entrypoint: string };
      result: ReadContractResponse;
    };

export type Operations = ReadOperations | WriteOperations;
export type Operation = Operations['operation'];
type WriteOperation = WriteOperations['operation'];

const writeMethods: UnionToTuple<WriteOperation> = ['add_transaction', 'call_contract'];

export function isWriteOperation(s: Operation): s is WriteOperation {
  return writeMethods.includes(s as WriteOperation);
}

export type ExtractOperation<U extends Operations['operation']> = Extract<
  Operations,
  { operation: U }
> extends {
  payload: infer P;
}
  ? [operation: U, payload: P]
  : [operation: U];

export type ExtractResult<U extends Operations['operation']> = Extract<
  Operations,
  { operation: U }
> extends {
  result: infer R;
}
  ? R
  : never;

export type Endpoints = {
  [K in Operations['operation']]: Extract<Operations, { operation: K }> extends {
    endpoint: infer E;
  }
    ? E
    : K;
};

// TODO: find a way to replace `string` by `Operations['operation'] | Operations['endpoint']`
export type UrlPathname = `${Gateway}/${string}`;
