import type { Gateway, UrlPathname, Network, Operation, Endpoints } from './types';
import { isWriteOperation } from './types';
import type { AxiosRequestConfig, Method } from 'axios';

const networkBaseUrl: Record<Network, string> = {
  mainnet: 'https://alpha-mainnet.starknet.io',
  goerli: 'https://alpha4.starknet.io',
};

const endpoints: Endpoints = {
  get_block_by_number: 'get_block',
  get_block_by_hash: 'get_block',
  get_latest_block: 'get_block',
  get_block_hash_by_id: 'get_block_hash_by_id',
  get_block_id_by_hash: 'get_block_id_by_hash',
  get_transaction_by_hash: 'get_transaction',
  get_transaction_status: 'get_transaction_status',
  get_transaction_receipt: 'get_transaction_receipt',
  get_transaction_hash_by_id: 'get_transaction_hash_by_id',
  get_transaction_id_by_hash: 'get_transaction_id_by_hash',
  get_code: 'get_code',
  get_contract_addresses: 'get_contract_addresses',
  get_storage_at: 'get_storage_at',
  call_contract: 'call_contract',
  add_transaction: 'add_transaction',
};

export class RequestBuilder {
  private readonly _baseUrl: string;

  constructor(network: Network) {
    this._baseUrl = networkBaseUrl[network];
  }

  public create(operation: Operation, payload: unknown): AxiosRequestConfig {
    const url = new URL(this._baseUrl);
    url.pathname = this._getPathnameFromOperation(operation);
    url.search = this._getSearchParams(payload as Record<string, string>);
    const method = this._getHttpMethodFromOperation(operation);
    return {
      method,
      url: url.toString(),
    };
  }

  private _getSearchParams(payload?: Record<string, string>) {
    if (!payload) return '';
    const searchParams = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, value);
      }
    });
    return searchParams.toString();
  }

  private _getPathnameFromOperation(operation: Operation): UrlPathname {
    const gateway = this._getGatewayFromOperation(operation);
    const endpoint = endpoints[operation];
    return `${gateway}/${endpoint}`;
  }

  /**
   * Get the gateway from operation. Most of the operations use 'feeder_gateway' except for 'add_transaction' which uses 'gateway'
   * @param {Operation} operation
   * @returns {Gateway} 'gateway' if the operation is 'add_transaction'. Otherwise 'feeder_gateway'
   */
  private _getGatewayFromOperation(operation: Operation): Gateway {
    return operation === 'add_transaction' ? 'gateway' : 'feeder_gateway';
  }

  private _getHttpMethodFromOperation(operation: Operation): Method {
    return isWriteOperation(operation) ? 'POST' : 'GET';
  }
}
