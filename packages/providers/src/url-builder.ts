import type { Gateway, UrlPathname, Network, Operation, Endpoints } from './types';
import { isReadOperation } from './types';

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
  add_transaction: 'add_transaction',
};

export class UrlBuilder {
  private readonly _baseUrl: string;

  constructor(network: Network) {
    this._baseUrl = networkBaseUrl[network];
  }

  public create(operation: Operation, payload: unknown) {
    const url = new URL(this._baseUrl);
    url.pathname = this._getPathnameFromOperation(operation);
    url.search = this._getSearchParams(payload as Record<string, string>);
    return url.toString();
  }

  private _getSearchParams(payload?: Record<string, string>) {
    if (!payload) return '';
    const searchParams = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value) {
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

  private _getGatewayFromOperation(operation: Operation): Gateway {
    return isReadOperation(operation) ? 'feeder_gateway' : 'gateway';
  }
}
