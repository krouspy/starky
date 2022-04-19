export const defaultEntryPoints = ['__default__', '__l1_default__'] as const;
type DefaultEntryPoint = typeof defaultEntryPoints[number];

export function isDefaultEntryPoint(s: string): s is DefaultEntryPoint {
  return defaultEntryPoints.includes(s as DefaultEntryPoint);
}

export type Selector = {
  hex: string;
  int: string;
};
