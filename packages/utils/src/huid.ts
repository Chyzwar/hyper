import {randomBytes} from "crypto";

/**
 * Safe and short uuid implementation of ULID
 */
function huid(): string {
  const random = randomBytes(12).toString("base64");  
  const time = Date.now().toString(32);
 
  return `${time}-${random}`;
}


export default huid;