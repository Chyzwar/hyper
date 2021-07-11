import PathParams from "../path/PathParams.js";
import PathString from "../path/PathString.js";
import PathRegExp from "../path/PathRegExp.js";
import hasParams from "./hasParams.js";
import type Path from "../path/types/Path.js";

/**
 * Factory function for Path
 */
function createPath(path: RegExp | string): Path {
  if (path instanceof RegExp) {
    return new PathRegExp(path);
  }
  else {
    if (hasParams(path)) {
      return new PathParams(path);
    }
    else {
      return new PathString(path);
    }
  }
}


export default createPath;