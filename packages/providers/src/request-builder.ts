import type { AxiosRequestConfig, Method } from 'axios';
import type {
  Gateway,
  UrlPathname,
  Network,
  ExtractOperation,
  Operations,
  Operation,
  Endpoints,
} from './types';
import { isPostOperation } from './utils';

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
  get_nonce: 'call_contract',
  call_contract: 'call_contract',
  invoke_contract: 'add_transaction',
  deploy_contract: 'add_transaction',
};

export class RequestBuilder {
  private readonly _baseUrl: string;

  constructor(network: Network) {
    this._baseUrl = networkBaseUrl[network];
  }

  public create<TOperation extends Operations['operation']>(
    args: ExtractOperation<TOperation>
  ): AxiosRequestConfig {
    const { operation, queryParameters, payload } = args;
    const url = new URL(this._baseUrl);
    url.pathname = this._getPathnameFromOperation(operation);
    url.search = this._getSearchParams(queryParameters as Record<string, string>);
    const method = this._getHttpMethodFromOperation(operation);
    const body = this._getBodyRequest(operation, payload);
    return {
      method,
      url: url.toString(),
      data: body,
    };
  }

  private _getBodyRequest(operation: Operation, payload: unknown) {
    return isPostOperation(operation) ? JSON.stringify(payload) : undefined;
  }

  private _getSearchParams(queryParameters?: Record<string, string>) {
    if (!queryParameters) return '';
    const searchParams = new URLSearchParams();
    Object.entries(queryParameters).forEach(([key, value]) => {
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
    const endpoint = endpoints[operation];
    return endpoint === 'add_transaction' ? 'gateway' : 'feeder_gateway';
  }

  private _getHttpMethodFromOperation(operation: Operation): Method {
    return isPostOperation(operation) ? 'POST' : 'GET';
  }
}
