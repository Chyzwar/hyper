/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {removePrefix, removeSuffix, prefixWith} from "@hyper/utils";

import Chars from "../enums/Chars.js";
import isParam from "../utils/isParam.js";
import type MatchParams from "./types/MatchParams.js";
import type Match from "./types/Match.js";
import type Path from "./types/Path.js";
import type PathOptions from "./types/PathIOptions.js";

class PathParams implements Path {
  public match!: (url?: string) => MatchParams | boolean;
  private parts!: string[];
  private params!: boolean[];
  private path!: string;

  public constructor(path: string) {
    this.setPath(path);
  }

  /**
   * Configure path, create match function
   */
  public mount(options: PathOptions): void {
    const {
      sensitive,
      strict,
      end,
      start,
    } = options;

    const {
      parts,
      params,
    } = this;

    if (start && end) {
      this.match = (url: string | undefined = Chars.Slash): MatchParams | boolean => {
        if (url !== Chars.Slash) {
          if (!strict) {
            url = removeSuffix(url, Chars.Slash);
          }
        }
        else {
          return false;
        }

        const urls = url.split(Chars.Slash);
        let match: Match = false;

        if (parts.length === urls.length) {
          const {length} = urls;
          for (let i = 0; i < length; i++) {
            if (params[i]) {
              if (match) {
                match.params[parts[i]] = urls[i];
              }
              else {
                match = {
                  params: {
                    [parts[i]]: urls[i],
                  },
                };
              }
            }
            else {
              if (sensitive) {
                if (urls[i] !== parts[i]) {
                  return false;
                }
              }
              else {
                if (urls[i].toLowerCase() !== parts[i].toLowerCase()) {
                  return false;
                }
              }
            }
          }

          return match;
        }

        return false;
      };
    }

    if (start && !end) {
      this.match = (url: string = Chars.Slash): MatchParams | boolean => {
        if (url !== Chars.Slash) {
          if (!strict) {
            url = removeSuffix(url, Chars.Slash);
          }
        }
        else {
          return false;
        }

        const urls = url.split(Chars.Slash);
        let match: Match = false;
        const {length} = parts;
        if (urls.length >= length) {
          for (let i = 0; i < length; i++) {
            if (params[i]) {
              if (match) {
                match.params[parts[i]] = urls[i];
              }
              else {
                match = {
                  params: {
                    [parts[i]]: urls[i],
                  },
                };
              }
            }
            else {
              if (sensitive) {
                if (urls[i] !== parts[i]) {
                  return false;
                }
              }
              else {
                if (urls[i].toLowerCase() !== parts[i].toLowerCase()) {
                  return false;
                }
              }
            }
          }
          if (match) {
            match.rest = prefixWith(
              urls.slice(length).join(Chars.Slash),
              Chars.Slash
            );
          }
        }

        return match;
      };
    }
  }

  /**
   * Set params and path keys
   */
  private setPath(path: string): void {
    this.path = prefixWith(path, Chars.Slash);
    this.parts = [];
    this.params = [];

    this.path
      .split(Chars.Slash)
      .forEach(
        (part: string) => {
          if (isParam(part)) {
            this.parts.push(removePrefix(part, Chars.Colon));
            this.params.push(true);
          }
          else {
            this.parts.push(part);
            this.params.push(false);
          }
        }
      );
  }
}

export default PathParams;
