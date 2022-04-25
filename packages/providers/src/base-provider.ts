import axios, { type AxiosInstance } from 'axios';
import { getSelectorFromName } from '@starky/selector';
import type {
  Network,
  Operations,
  ExtractOperation,
  ExtractResult,
  ContractDefinition,
  ContractInteraction,
} from './types';
import { RequestBuilder } from './request-builder';
import { isPositiveInteger, getHexAddress } from './utils';
import { getErrorMessage } from './error';

export class Provider {
  private readonly _requestBuilder: RequestBuilder;
  private readonly _axios: AxiosInstance;

  /**
   * Create a provider connected to the specified network
   * @param network - Network
   */
  constructor(network: Network) {
    this._requestBuilder = new RequestBuilder(network);
    this._axios = axios.create({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  async callContract({
    contractAddress,
    functionName,
    signature = [],
    calldata = [],
  }: ContractInteraction) {
    const selector = getSelectorFromName(functionName);
    return this._sendRequest({
      operation: 'call_contract',
      payload: {
        contract_address: contractAddress,
        entry_point_selector: selector.hex,
        signature,
        calldata,
      },
    });
  }

  async invokeContract({
    contractAddress,
    functionName,
    signature = [],
    calldata = [],
  }: ContractInteraction) {
    const selector = getSelectorFromName(functionName);
    return this._sendRequest({
      operation: 'invoke_contract',
      payload: {
        type: 'INVOKE_FUNCTION',
        contract_address: contractAddress,
        entry_point_selector: selector.hex,
        signature,
        calldata,
      },
    });
  }

  async deployContract(publicKey: string, contractDefinition: ContractDefinition) {
    return this._sendRequest({
      operation: 'deploy_contract',
      payload: {
        type: 'DEPLOY',
        contract_address_salt: publicKey,
        constructor_calldata: [],
        contract_definition: contractDefinition,
      },
    });
  }

  async getNonce(contractAddress: string) {
    const selector = getSelectorFromName('get_nonce');
    const { result } = await this._sendRequest({
      operation: 'get_nonce',
      payload: {
        contract_address: contractAddress,
        entry_point_selector: selector.hex,
        signature: [],
        calldata: [],
      },
    });
    return result[0];
  }

  async getLatestBlock() {
    return this._sendRequest({ operation: 'get_latest_block' });
  }

  async getBlockByNumber(blockNumber: number) {
    if (!isPositiveInteger(blockNumber))
      throw new Error('Provider: blockNumber must be a positive integer');
    return this._sendRequest({
      operation: 'get_block_by_number',
      queryParameters: { blockNumber },
    });
  }

  async getBlockByHash(blockHash: string) {
    return this._sendRequest({
      operation: 'get_block_by_hash',
      queryParameters: { blockHash },
    });
  }

  async getBlockHashById(blockId: number) {
    if (!isPositiveInteger(blockId))
      throw new Error('Provider: blockId must be a positive integer');
    return this._sendRequest({
      operation: 'get_block_hash_by_id',
      queryParameters: { blockId },
    });
  }

  async getBlockIdByHash(blockHash: string) {
    return this._sendRequest({
      operation: 'get_block_id_by_hash',
      queryParameters: { blockHash },
    });
  }

  async getTransaction(transactionHash: string) {
    return this._sendRequest({
      operation: 'get_transaction_by_hash',
      queryParameters: { transactionHash },
    });
  }

  async getTransactionStatus(transactionHash: string) {
    return this._sendRequest({
      operation: 'get_transaction_status',
      queryParameters: { transactionHash },
    });
  }

  async getTransactionReceipt(transactionHash: string) {
    return this._sendRequest({
      operation: 'get_transaction_receipt',
      queryParameters: { transactionHash },
    });
  }

  async getTransactionHashById(transactionId: number) {
    if (!isPositiveInteger(transactionId))
      throw new Error('Provider: transactionId must be a positive integer');
    return this._sendRequest({
      operation: 'get_transaction_hash_by_id',
      queryParameters: { transactionId },
    });
  }

  async getTransactionIdByHash(transactionHash: string) {
    return this._sendRequest({
      operation: 'get_transaction_id_by_hash',
      queryParameters: { transactionHash },
    });
  }

  /**
   * Get the abi and bytecode of a contract using its hex or int address. If the contract address is passed as an int (without '0x' prefix) then it is converted into hex
   * @param contractAddress String
   * @returns A promise that resolves to the contract abi and bytecode
   */
  async getContractCodeByAddress(contractAddress: string) {
    const contractAddressHex = getHexAddress(contractAddress);
    return this._sendRequest({
      operation: 'get_code',
      queryParameters: { contractAddress: contractAddressHex },
    });
  }

  /**
   * Get Starknet contract addresses
   * @returns A promise that resolves to the Starknet contract addresses
   */
  async getContractAddresses() {
    return this._sendRequest({ operation: 'get_contract_addresses' });
  }

  /**
   * Get a contract storage value at a given slot. If the contract address is passed as an int (without '0x' prefix) then it is converted into hex
   * @param contractAddress String
   * @returns A promise that resolves to the storage slot value
   */
  async getStorageAt(contractAddress: string, slot: number) {
    if (!isPositiveInteger(slot)) throw new Error('Provider: key must be a positive integer');
    const contractAddressHex = getHexAddress(contractAddress);
    return this._sendRequest({
      operation: 'get_storage_at',
      queryParameters: { contractAddress: contractAddressHex, key: slot },
    });
  }

  /**
   * Perform HTTP requests
   * @param ...args The first parameter is the operation to perform and the second and thrid parameters type areinferred from the first parameter
   * @returns A promise that resolves to the HTTP response
   */
  private async _sendRequest<TOperation extends Operations['operation']>(
    args: ExtractOperation<TOperation>
  ): Promise<ExtractResult<TOperation>> {
    try {
      const { method, url, data: body } = this._requestBuilder.create(args);
      const { data } = await this._axios.request({ method, url, data: body });
      return data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error));
    }
  }
}
