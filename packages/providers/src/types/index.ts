import type {
  GetBlockResponse,
  GetBlockHashByIdResponse,
  GetTransactionResponse,
  GetTransactionStatusResponse,
  GetTransactionReceiptResponse,
  GetTransactionHashByIdResponse,
  GetContractCodeResponse,
  GetContractAddressesResponse,
  GetNonceResponse,
} from './responses';
import type { UnionToTuple } from './utils';

export type Network = 'mainnet' | 'goerli';
export type Gateway = 'gateway' | 'feeder_gateway';

export type ReadOperations =
  | {
      operation: 'get_block_by_number';
      endpoint: 'get_block';
      queryParameters: { blockNumber: number };
      result: GetBlockResponse;
    }
  | {
      operation: 'get_block_by_hash';
      endpoint: 'get_block';
      queryParameters: { blockHash: string };
      result: GetBlockResponse;
    }
  | {
      operation: 'get_latest_block';
      endpoint: 'get_block';
      result: GetBlockResponse;
    }
  | {
      operation: 'get_block_hash_by_id';
      queryParameters: { blockId: number };
      result: GetBlockHashByIdResponse;
    }
  | {
      operation: 'get_block_id_by_hash';
      queryParameters: { blockHash: string };
      result: number;
    }
  | {
      operation: 'get_transaction_by_hash';
      endpoint: 'get_transaction';
      queryParameters: { transactionHash: string };
      result: GetTransactionResponse;
    }
  | {
      operation: 'get_transaction_status';
      queryParameters: { transactionHash: string };
      result: GetTransactionStatusResponse;
    }
  | {
      operation: 'get_transaction_receipt';
      queryParameters: { transactionHash: string };
      result: GetTransactionReceiptResponse;
    }
  | {
      operation: 'get_transaction_hash_by_id';
      queryParameters: { transactionId: number };
      result: GetTransactionHashByIdResponse;
    }
  | {
      operation: 'get_transaction_id_by_hash';
      queryParameters: { transactionHash: string };
      result: number;
    }
  | {
      operation: 'get_code';
      queryParameters: { contractAddress: string };
      result: GetContractCodeResponse;
    }
  | {
      operation: 'get_contract_addresses';
      result: GetContractAddressesResponse;
    }
  | {
      operation: 'get_storage_at';
      queryParameters: { contractAddress: string; key: number };
      result: string;
    };

type WriteOperations =
  | {
      operation: 'add_transaction';
      queryParameters: { transactionHash: string };
      result: GetTransactionResponse;
    }
  | {
      operation: 'get_nonce';
      endpoint: 'call_contract';
      payload: { contract_address: string; entry_point_selector: string };
      result: GetNonceResponse;
    };

export type Operations = ReadOperations | WriteOperations;
export type Operation = Operations['operation'];
type WriteOperation = WriteOperations['operation'];

const writeMethods: UnionToTuple<WriteOperation> = ['add_transaction', 'get_nonce'];

export function isWriteOperation(s: Operation): s is WriteOperation {
  return writeMethods.includes(s as WriteOperation);
}

export type ExtractOperation<U extends Operations['operation']> = Extract<
  Operations,
  { operation: U }
> extends {
  queryParameters: infer Q;
  payload: infer P;
}
  ? { operation: U; queryParameters: Q; payload: P }
  : Extract<Operations, { operation: U }> extends { queryParameters: infer Q }
  ? { operation: U; queryParameters: Q; payload?: never }
  : Extract<Operations, { operation: U }> extends { payload: infer P }
  ? { operation: U; queryParameters?: never; payload: P }
  : { operation: U; queryParameters?: never; payload?: never };

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
