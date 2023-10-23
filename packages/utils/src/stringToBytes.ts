/* eslint-disable @typescript-eslint/no-type-alias */

const map: Record<string, number> = {
  b: 1,
  B: 1,

  kb: 1024,
  KB: 1024,
  Kb: 1024,
  kB: 1024,

  mb: 1048576,
  MB: 1048576,
  Mb: 1048576,
  mB: 1048576,

  gB: 1073741824,
  gb: 1073741824,
  GB: 1073741824,
  Gb: 1073741824,

  tb: 1099511627776,
  TB: 1099511627776,
  Tb: 1099511627776,
  tB: 1099511627776,

  pb: 1125899906842624,
  PB: 1125899906842624,
  Pb: 1125899906842624,
  pB: 1125899906842624,
};

/**
 * Decide if we want to keep supporting case inventive
 */
const parse = /^(?<amount>(-|\+)?(\d+(?:\.\d+)?)) *(?<unit>b|kb|mb|gb|tb|pb)$/i;

export type Bytes = `${number}${
  "B" 
  | "b" 
  | "GB" 
  | "Gb" 
  | "gB" 
  | "gb" 
  | "KB" 
  | "Kb" 
  | "kB" 
  | "kb" 
  | "MB" 
  | "Mb" 
  | "mB" 
  | "mb" 
  | "PB" 
  | "Pb" 
  | "pB" 
  | "pb" 
  | "TB" 
  | "Tb" 
  | "tB"
  | "tb"
}`;

/**
 * Parse to string to an number of bytes.
 *
 * @example
 * stringToBytes('1b');  // 1
 * stringToBytes('1KB'); // 1024
 * stringToBytes('1TB'); // 1099511627776
 */
function stringToBytes(value: Bytes): number {
  const result = parse.exec(value);

  if (!result?.groups?.unit || !result.groups.amount) {
    throw new Error(`Invalid value: ${value}`);
  }

  const {
    groups: {
      unit,
      amount,
    },
  } = result;

  const {
    [unit]: bytes,
  } = map;

  return Number(amount) * Number(bytes);
}

export default stringToBytes;