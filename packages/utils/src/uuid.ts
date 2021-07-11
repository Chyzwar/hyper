import {randomBytes} from "crypto";

const bth: string[] = [];
for (let i = 0; i < 256; ++i) {
  bth[i] = (i + 0x100).toString(16).substr(1);
}

/**
 * Generate UUID version 4
 */
function uuid(): string {
  const random: Buffer = randomBytes(16);
  
  random[6] = random[6] & 0x0f | 0x40; // version bits
  random[8] = random[8] & 0x3f | 0x80; // clock_seq_hi_and_reserved

  return [
    bth[random[0]],
    bth[random[1]],
    bth[random[2]],
    bth[random[3]],
    "-",
    bth[random[3]],
    bth[random[5]],
    "-",
    bth[random[6]],
    bth[random[7]],
    "-",
    bth[random[8]],
    bth[random[9]],
    "-",
    bth[random[10]],
    bth[random[11]],
    bth[random[12]],
    bth[random[13]],
    bth[random[14]],
    bth[random[15]],
  ].join("");
}

export default uuid;