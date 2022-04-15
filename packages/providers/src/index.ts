import axios from 'axios';
import { BigNumber } from '@ethersproject/bignumber';
import type { Network, Operations, ExtractOperation, ExtractResult } from './types';
import { UrlBuilder } from './url-builder';
import { isPositiveInteger } from './utils';

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
    if (!isPositiveInteger(blockNumber))
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
    if (!isPositiveInteger(blockId))
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
    if (!isPositiveInteger(transactionId))
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
   * Get the abi and bytecode of a contract using its hex or int address. If the contract address is passed as an int (without '0x' prefix) then it is converted into hex
   * @param contractAddress String
   * @returns A promise that resolves to the contract abi and bytecode
   */
  async getContractCodeByAddress(contractAddress: string) {
    const contractAddressHex = contractAddress.startsWith('0x')
      ? contractAddress
      : BigNumber.from(contractAddress).toHexString();
    return this._sendRequest('get_code', { contractAddress: contractAddressHex });
  }

  /**
   * Get Starknet contract addresses
   * @returns A promise that resolves to the Starknet contract addresses
   */
  async getContractAddresses() {
    return this._sendRequest('get_contract_addresses');
  }

  /**
   * Get a contract storage value at a given slot. If the contract address is passed as an int (without '0x' prefix) then it is converted into hex
   * @param contractAddress String
   * @returns A promise that resolves to the storage slot value
   */
  async getStorageAt(contractAddress: string, slot: number) {
    if (!isPositiveInteger(slot)) throw new Error('Provider: key must be a positive integer');
    const contractAddressHex = contractAddress.startsWith('0x')
      ? contractAddress
      : BigNumber.from(contractAddress).toHexString();
    return this._sendRequest('get_storage_at', { contractAddress: contractAddressHex, key: slot });
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
