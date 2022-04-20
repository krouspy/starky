import { z } from 'zod';

const StatusSchema = z.union([
  z.literal('RECEIVED'),
  z.literal('NOT_RECEIVED'),
  z.literal('PENDING'),
  z.literal('ACCEPTED_ON_L1'),
  z.literal('ACCEPTED_ON_L2'),
  z.literal('REJECTED'),
]);

export const BlockHashSchema = z.string().min(62);
export const TransactionHashSchema = z.string().min(62);

const BaseTransactionSchema = z
  .object({
    transaction_hash: TransactionHashSchema,
    contract_address: z.string().min(63),
    type: z.string(),
  })
  .strict();

const InvokeFunctionSchema = BaseTransactionSchema.extend({
  entry_point_selector: z.string(),
  entry_point_type: z.string(),
  calldata: z.string().array(),
  signature: z.string().array(),
  max_fee: z.string(),
}).strict();

const DeployContractSchema = BaseTransactionSchema.extend({
  contract_address_salt: z.string(),
  constructor_calldata: z.string().array(),
  class_hash: z.string().optional(),
}).strict();

const TransactionSchema = z.union([InvokeFunctionSchema, DeployContractSchema]);

export const GetTransactionSchema = z
  .object({
    status: StatusSchema,
    block_hash: BlockHashSchema,
    block_number: z.number(),
    transaction_index: z.number(),
    transaction: TransactionSchema,
  })
  .strict();

export const GetTransactionReceiptSchema = z
  .object({
    status: StatusSchema.optional(),
    block_hash: BlockHashSchema.optional(),
    block_number: z.number().optional(),
    transaction_index: z.number(),
    transaction_hash: TransactionHashSchema,
    l2_to_l1_messages: z
      .object({
        from_address: z.string(),
        to_address: z.string(),
        payload: z.string().array(),
      })
      .strict()
      .array(),
    l1_to_l2_consumed_message: z
      .object({
        from_address: z.string(),
        to_address: z.string(),
        selector: z.string(),
        payload: z.string().array(),
        nonce: z.string(),
      })
      .strict()
      .optional(),
    actual_fee: z.string().optional(),
    events: z
      .object({
        from_address: z.string(),
        keys: z.string().array(),
        data: z.string().array(),
      })
      .strict()
      .array(),
    execution_resources: z
      .object({
        n_steps: z.number(),
        builtin_instance_counter: z.object({
          pedersen_builtin: z.number().optional(),
          range_check_builtin: z.number().optional(),
          ecdsa_builtin: z.number().optional(),
          output_builtin: z.number().optional(),
          bitwise_builtin: z.number().optional(),
          ec_op_builtin: z.number().optional(),
        }),
        n_memory_holes: z.number(),
      })
      .strict(),
  })
  .strict();

export const GetBlockSchema = z
  .object({
    block_hash: BlockHashSchema,
    parent_block_hash: BlockHashSchema,
    block_number: z.number().min(0),
    state_root: z.string(),
    status: StatusSchema,
    timestamp: z.number().min(0),
    transactions: TransactionSchema.array(),
    transaction_receipts: GetTransactionReceiptSchema.array(),
  })
  .strict();

export const GetTransactionStatusSchema = z
  .object({
    tx_status: StatusSchema,
    block_hash: BlockHashSchema,
  })
  .strict();

export const GetContractCodeSchema = z
  .object({
    bytecode: z.string().array(),
    abi: z.array(z.any()),
  })
  .strict();

export const GetContractAddressesSchema = z
  .object({
    Starknet: z.string(),
    GpsStatementVerifier: z.string(),
  })
  .strict();

export const GetNonceSchema = z.object({
  result: z.string().array(),
});
