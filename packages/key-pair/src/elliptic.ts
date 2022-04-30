import { ec as EC, curves } from 'elliptic';
import hashJS from 'hash.js';
import { FIELD_PRIME, EC_ORDER, CONSTANT_POINTS } from './constants';

export type ECKeyPair = EC.KeyPair;

export const ec = new EC(
  new curves.PresetCurve({
    type: 'short',
    prime: null,
    p: FIELD_PRIME,
    a: '00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001',
    b: '06f21413 efbe40de 150e596d 72f7a8c5 609ad26c 15c915c1 f4cdfcb9 9cee9e89',
    n: EC_ORDER,
    hash: hashJS.sha256,
    gRed: false,
    g: CONSTANT_POINTS[1],
  })
);
