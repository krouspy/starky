import axios from 'axios';
import type { Network, Operations, ExtractOperation, ExtractResult } from './types';
import { UrlBuilder } from './url-builder';

export class Provider {
  private readonly _urlBuilder: UrlBuilder;

  constructor(network: Network) {
    this._urlBuilder = new UrlBuilder(network);
  }

  async getLatestBlock() {
    return this._sendRequest('get_latest_block');
  }

  async getBlockByNumber(blockNumber: number) {
    if (blockNumber < 0 || !Number.isInteger(blockNumber))
      throw new Error('Provider: blockNumber must be a positive integer');
    return this._sendRequest('get_block_by_number', { blockNumber });
  }

  // TODO: check correctness of blockHash
  async getBlockByHash(blockHash: string) {
    return this._sendRequest('get_block_by_hash', { blockHash });
  }

  async getBlockHashById(blockId: number) {
    if (blockId < 0 || !Number.isInteger(blockId))
      throw new Error('Provider: blockId must be a positive integer');
    return this._sendRequest('get_block_hash_by_id', { blockId });
  }

  // TODO: check correctness of blockHash
  async getBlockIdByHash(blockHash: string) {
    return this._sendRequest('get_block_id_by_hash', { blockHash });
  }

  // TODO: check correctness of transactionHash
  async getTransaction(transactionHash: string) {
    return this._sendRequest('get_transaction_by_hash', { transactionHash });
  }

  // TODO: check correctness of transactionHash
  async getTransactionStatus(transactionHash: string) {
    return this._sendRequest('get_transaction_status', { transactionHash });
  }

  // TODO: check correctness of transactionHash
  async getTransactionReceipt(transactionHash: string) {
    return this._sendRequest('get_transaction_receipt', { transactionHash });
  }

  async getTransactionHashById(transactionId: number) {
    if (transactionId < 0 || !Number.isInteger(transactionId))
      throw new Error('Provider: transactionId must be a positive integer');
    return this._sendRequest('get_transaction_hash_by_id', { transactionId });
  }

  // TODO: check correctness of transactionHash
  async getTransactionIdByHash(transactionHash: string) {
    return this._sendRequest('get_transaction_id_by_hash', { transactionHash });
  }

  private async _sendRequest<TOperation extends Operations['operation']>(
    ...args: ExtractOperation<TOperation>
  ): Promise<ExtractResult<TOperation>> {
    const [operation, payload] = args;
    const url = this._urlBuilder.create(operation, payload);
    const { data } = await axios.get(url);
    return data;
  }
}
