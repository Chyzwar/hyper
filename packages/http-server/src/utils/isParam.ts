import Chars from "../enums/Chars.js";

/**
 * Check if path segment is param
 * @example
 * isParam("foo") // false
 * isParam(":foo") // true
 */
function isParam(segment: string): boolean {
  return segment.startsWith(Chars.Colon);
}

export default isParam;