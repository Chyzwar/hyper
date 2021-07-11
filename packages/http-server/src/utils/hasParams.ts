
import Chars from "../enums/Chars.js";
import isParam from "./isParam.js";


/**
 * Check if url path contain param segment
 * @example
 * hasParams('/:foo/bar') // true
 * hasParams('/foo/bar') // false
 */
function hasParams(path: string): boolean {
  return path.split(Chars.Slash).some(isParam);
}

export default hasParams;