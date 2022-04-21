export const hasHexPrefix = (str: string) => str.startsWith('0x');
export const removeHexPrefix = (hex: string) => hex.replace(/^0x/, '');
export const addHexPrefix = (str: string) => {
  return hasHexPrefix(str) ? str : `0x${str}`;
};
