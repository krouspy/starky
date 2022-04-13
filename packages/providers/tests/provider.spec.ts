import { Provider } from '../src';

const provider = new Provider('goerli');
const blockHash = '0x6a6932effb58a2e23fcb3a648b6bbf4f973cf34c7e286e804dd5386057d206d';
const txHash = '0x2245e63c6d7cd67c3325ba3d94f2d21370285ec978a22d087d93d531bfb189f';

describe('provider', () => {
  describe("getBlock(blockNumber | blockHash | 'latest')", () => {
    test('getBlock(blockNumber)', async () => {
      expect(await provider.getBlockByNumber(140000)).toBeBlock();
    });

    test('getBlock(blockHash)', async () => {
      expect(await provider.getBlockByHash(blockHash)).toBeBlock();
    });

    test("getBlock('latest')", async () => {
      expect(await provider.getLatestBlock()).toBeBlock();
    });

    test('getBlockHashById(153399)', async () => {
      expect(await provider.getBlockHashById(140000)).toBeBlockHash();
    });

    test('getBlockIdByHash(blockHash)', async () => {
      const blockId = await provider.getBlockIdByHash(blockHash);
      expect(blockId).toBeGreaterThan(0);
    });

    test('throw getBlock(negativeNumber)', async () => {
      await expect(provider.getBlockByNumber(-10)).rejects.toThrowError(
        'Provider: blockNumber must be a positive integer'
      );
    });
  });

  describe('getTransaction(hash)', () => {
    test('getTransaction(transactionHash)', async () => {
      expect(await provider.getTransaction(txHash)).toBeTransaction();
    });

    test('getTransactionStatus(transactionHash)', async () => {
      expect(await provider.getTransactionStatus(txHash)).toBeTransactionStatus();
    });

    test('getTransactionReceipt(transactionHash)', async () => {
      expect(await provider.getTransactionReceipt(txHash)).toBeTransactionReceipt();
    });

    test('getTransactionHashById(transactionId)', async () => {
      expect(await provider.getTransactionHashById(3124872)).toBeTransactionHash();
    });

    test('getTransactionIdByHash(transactionHash)', async () => {
      const transactionId = await provider.getTransactionIdByHash(txHash);
      expect(transactionId).toBeGreaterThan(0);
    });

    test('throw getTransactionHashById(negativeNumber)', async () => {
      await expect(provider.getTransactionHashById(-10)).rejects.toThrowError(
        'Provider: transactionId must be a positive integer'
      );
    });
  });
});
