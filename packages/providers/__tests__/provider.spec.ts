import { BigNumber } from '@ethersproject/bignumber';
import { Provider } from '../src';

const provider = new Provider('goerli');
const blockHash = '0x6a6932effb58a2e23fcb3a648b6bbf4f973cf34c7e286e804dd5386057d206d';
const txHash = '0x2245e63c6d7cd67c3325ba3d94f2d21370285ec978a22d087d93d531bfb189f';
const contractAddress = '0x02a1178121f83d39486080c026fd37d70edc2d7e0649d71b28ed9f4bdd9a0914';

describe('Provider', () => {
  describe("getBlock(blockNumber | blockHash | 'latest')", () => {
    it('getBlock(blockNumber)', async () => {
      expect(await provider.getBlockByNumber(140000)).toBeBlock();
    });

    it('getBlock(blockHash)', async () => {
      expect(await provider.getBlockByHash(blockHash)).toBeBlock();
    });

    it("getBlock('latest')", async () => {
      expect(await provider.getLatestBlock()).toBeBlock();
    });

    it('getBlockHashById(153399)', async () => {
      expect(await provider.getBlockHashById(140000)).toBeBlockHash();
    });

    it('getBlockIdByHash(blockHash)', async () => {
      const blockId = await provider.getBlockIdByHash(blockHash);
      expect(blockId).toBeGreaterThan(0);
    });

    it('throw getBlock(negativeNumber)', async () => {
      await expect(provider.getBlockByNumber(-10)).rejects.toThrowError(
        'Provider: blockNumber must be a positive integer'
      );
    });
  });

  describe('getTransaction(hash)', () => {
    it('getTransaction(transactionHash)', async () => {
      expect(await provider.getTransaction(txHash)).toBeTransaction();
    });

    it('getTransactionStatus(transactionHash)', async () => {
      expect(await provider.getTransactionStatus(txHash)).toBeTransactionStatus();
    });

    it('getTransactionReceipt(transactionHash)', async () => {
      expect(await provider.getTransactionReceipt(txHash)).toBeTransactionReceipt();
    });

    it('getTransactionHashById(transactionId)', async () => {
      expect(await provider.getTransactionHashById(3124872)).toBeTransactionHash();
    });

    it('getTransactionIdByHash(transactionHash)', async () => {
      const transactionId = await provider.getTransactionIdByHash(txHash);
      expect(transactionId).toBeGreaterThan(0);
    });

    it('throw getTransactionHashById(negativeNumber)', async () => {
      await expect(provider.getTransactionHashById(-10)).rejects.toThrowError(
        'Provider: transactionId must be a positive integer'
      );
    });
  });

  describe('getContractCodeByAddress()', () => {
    it('getContractCodeByAddress(contractAddressHex)', async () => {
      expect(await provider.getContractCodeByAddress(contractAddress)).toBeContractCode();
    });

    it('getContractCodeByAddress(contractAddressInt)', async () => {
      expect(
        await provider.getContractCodeByAddress(BigNumber.from(contractAddress).toString())
      ).toBeContractCode();
    });
  });

  it('getContractAddresses()', async () => {
    expect(await provider.getContractAddresses()).toBeContractAddresses();
  });

  describe('getContractAddress()', () => {
    it('getStorageAt(contractAddressHex, 0)', async () => {
      const slot = 0;
      const storage = await provider.getStorageAt(contractAddress, slot);
      expect(typeof storage).toBe('string');
    });

    it('getStorageAt(contractAddressInt, 0)', async () => {
      const slot = 0;
      const storage = await provider.getStorageAt(BigNumber.from(contractAddress).toString(), slot);
      expect(typeof storage).toBe('string');
    });

    it('throw getStorageAt(contractAddressHex, 0.5)', async () => {
      const slot = 0.5;
      await expect(provider.getStorageAt(contractAddress, slot)).rejects.toThrowError(
        'Provider: key must be a positive integer'
      );
    });

    it('throw getStorageAt(contractAddressHex, -1)', async () => {
      const slot = -1;
      await expect(provider.getStorageAt(contractAddress, slot)).rejects.toThrowError(
        'Provider: key must be a positive integer'
      );
    });
  });

  describe('getNonce()', () => {
    it('getNonce()', async () => {
      const address = '0x6965c8a5318fbd638949888fabbd54e247897dcd696f1b6e31db04485fa1277';
      const nonce = await provider.getNonce(address);
      expect(typeof nonce).toBe('string');
    });
  });
});
