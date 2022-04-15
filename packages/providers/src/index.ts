import axios from 'axios';
import type { Network, Operations, ExtractOperation, ExtractResult } from './types';
import { UrlBuilder } from './url-builder';

export class Provider {
  private readonly _urlBuilder: UrlBuilder;

  /**
   * Create a provider connected to the specified network
   * @param network - Network
   */
  constructor(network: Network) {
    this._urlBuilder = new UrlBuilder(network);
  }

  /**
   * Get the latest block
   * @returns a promise that resolves to the latest block
   */
  async getLatestBlock() {
    return this._sendRequest('get_latest_block');
  }

  /**
   * Get a block by its number
   * @param blockNumber Number
   * @returns a promise that resolves to the block
   */
  async getBlockByNumber(blockNumber: number) {
    if (blockNumber < 0 || !Number.isInteger(blockNumber))
      throw new Error('Provider: blockNumber must be a positive integer');
    return this._sendRequest('get_block_by_number', { blockNumber });
  }

  /**
   * Get a block by its hash
   * @param blockHash String
   * @returns a promise that resolves to the block
   */
  async getBlockByHash(blockHash: string) {
    return this._sendRequest('get_block_by_hash', { blockHash });
  }

  /**
   * Get the hash of a block by its id
   * @param blockId Number
   * @returns a promise that resolves to the block hash
   */
  async getBlockHashById(blockId: number) {
    if (blockId < 0 || !Number.isInteger(blockId))
      throw new Error('Provider: blockId must be a positive integer');
    return this._sendRequest('get_block_hash_by_id', { blockId });
  }

  /**
   * Get the id of a block its hash
   * @param blockHash String
   * @returns a promise that resolves to the block id
   */
  async getBlockIdByHash(blockHash: string) {
    return this._sendRequest('get_block_id_by_hash', { blockHash });
  }

  /**
   * Get a transaction by its hash
   * @param transactionHash String
   * @returns a promise that resolves to the transaction
   */
  async getTransaction(transactionHash: string) {
    return this._sendRequest('get_transaction_by_hash', { transactionHash });
  }

  /**
   * Get the status of a transaction
   * @param transactionHash String
   * @returns a promise that resolves to the transaction status
   */
  async getTransactionStatus(transactionHash: string) {
    return this._sendRequest('get_transaction_status', { transactionHash });
  }

  /**
   * Get the receipt of a transaction
   * @param transactionHash String
   * @returns A promise that resolves to the transaction receipt
   */
  async getTransactionReceipt(transactionHash: string) {
    return this._sendRequest('get_transaction_receipt', { transactionHash });
  }

  /**
   * Get the hash of a transaction by its id
   * @param transactionId Number
   * @returns A promise that resolves to the transaction hash
   */
  async getTransactionHashById(transactionId: number) {
    if (transactionId < 0 || !Number.isInteger(transactionId))
      throw new Error('Provider: transactionId must be a positive integer');
    return this._sendRequest('get_transaction_hash_by_id', { transactionId });
  }

  /**
   * Get the id of a transaction by its hash
   * @param transactionHash String
   * @returns A promise that resolves to the transaction id
   */
  async getTransactionIdByHash(transactionHash: string) {
    return this._sendRequest('get_transaction_id_by_hash', { transactionHash });
  }

  /**
   * Perform HTTP requests
   * @param ...args The first parameter is the operation to perform and the second parameter type is inferred from the first parameter
   * @returns A promise that resolves to the HTTP response
   */
  private async _sendRequest<TOperation extends Operations['operation']>(
    ...args: ExtractOperation<TOperation>
  ): Promise<ExtractResult<TOperation>> {
    const [operation, payload] = args;
    const url = this._urlBuilder.create(operation, payload);
    const { data } = await axios.get(url);
    return data;
  }
}
