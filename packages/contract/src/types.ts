export type Member = {
  name: string;
  offset: number;
  type: 'felt' | 'felt*' | (string & {});
};

export type Struct = {
  members: Member[];
  name: string;
  size: number;
  type: string;
};

export type Argument = {
  name: string;
  type: string;
};

export type CairoFunction = {
  stateMutability?: string;
  name: string;
  type: 'function' | 'constructor' | (string & {});
  inputs?: Argument[];
  outputs?: Argument[];
};

export type AbiEntry = CairoFunction | Struct;

export type Abi = AbiEntry[];
