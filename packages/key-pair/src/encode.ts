function padString(str: string, length: number, left: boolean, padding = '0'): string {
  const diff = length - str.length;
  let result = str;
  if (diff > 0) {
    const pad = padding.repeat(diff);
    result = left ? pad + str : str + pad;
  }
  return result;
}

function padLeft(str: string, length: number, padding = '0'): string {
  return padString(str, length, true, padding);
}

function calcByteLength(length: number, byteSize = 8): number {
  const remainder = length % byteSize;
  return remainder ? ((length - remainder) / byteSize) * byteSize + byteSize : length;
}

export function sanitizeBytes(str: string, byteSize = 8, padding = '0'): string {
  return padLeft(str, calcByteLength(str.length, byteSize), padding);
}
