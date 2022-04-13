import { z } from 'zod';
import {
  BlockHashSchema,
  TransactionHashSchema,
  GetBlockSchema,
  GetTransactionSchema,
  GetTransactionStatusSchema,
  GetTransactionReceiptSchema,
} from '../schemas/responses';

export type GetBlockResponse = z.infer<typeof GetBlockSchema>;
export type GetBlockHashByIdResponse = z.infer<typeof BlockHashSchema>;
export type GetTransactionResponse = z.infer<typeof GetTransactionSchema>;
export type GetTransactionStatusResponse = z.infer<typeof GetTransactionStatusSchema>;
export type GetTransactionReceiptResponse = z.infer<typeof GetTransactionReceiptSchema>;
export type GetTransactionHashByIdResponse = z.infer<typeof TransactionHashSchema>;
