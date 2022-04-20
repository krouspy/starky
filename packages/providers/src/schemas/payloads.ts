import { z } from 'zod';

export const CallContractPayloadSchema = z
  .object({
    contract_address: z.string(),
    entry_point_selector: z.string(),
    signature: z.string().array(),
    calldata: z.string().array(),
  })
  .strict();
