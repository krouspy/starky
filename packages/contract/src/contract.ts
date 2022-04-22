import { Provider } from '@starky/providers';
import type { Abi } from './types';

export class Contract {
  constructor(
    public readonly address: string,
    public readonly abi: Abi,
    private readonly _provider: Provider
  ) {}
}
