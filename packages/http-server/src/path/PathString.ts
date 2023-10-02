/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {removeSuffix, prefixWith} from "@hyper/utils";

import Chars from "../enums/Chars.js";
import type MatchPartial from "./types/MatchPartial.js";
import type Path from "./types/Path.js";
import type PathOptions from "./types/PathIOptions.js";

class PathString implements Path {
  public match!: (url?: string) => MatchPartial | boolean;
  private path!: string;

  public constructor(path: string) {
    if (path) {
      this.setPath(path);
    }
  }

  /**
   * Set and normalize starting slash
   */
  public setPath(path: string): this {
    this.path = removeSuffix(path, Chars.Slash);
    this.path = prefixWith(path, Chars.Slash);

    return this;
  }

  /**
   * Configure Path
   */
  public mount(options: PathOptions): void {
    const {
      sensitive,
      strict,
      end,
      start,
    } = options;

    const path = sensitive
      ? this.path
      : this.path.toLowerCase();

    this.match = (url: string = Chars.Slash): MatchPartial | boolean=> {
      if (!strict) {
        if (url !== Chars.Slash) {
          url = removeSuffix(url, Chars.Slash);
        }
      }

      if (!sensitive) {
        url = url.toLowerCase();
      }

      if (start && end) {
        return path === url;
      }

      if (!start && end) {
        return url.endsWith(path);
      }

      if (start && !end) {
        if (url.startsWith(path)) {
          const rest = url.substring(path.length);

          return {
            rest: prefixWith(rest, Chars.Slash),
          };
        }
      }

      return false;
    };
  }
}

export default PathString;
