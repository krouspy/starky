import { gzip } from 'pako';
import { stringify } from './json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compressProgram(program: Record<any, any>) {
  return Buffer.from(gzip(stringify(program))).toString('base64');
}
