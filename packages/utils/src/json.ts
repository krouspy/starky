import Json from 'json-bigint';

export const { stringify } = Json({
  alwaysParseAsBig: true,
  useNativeBigInt: true,
  protoAction: 'preserve',
  constructorAction: 'preserve',
});
