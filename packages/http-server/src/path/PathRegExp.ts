import type Path from "./types/Path.js";
import Chars from "../enums/Chars.js";

class PathRegExp implements Path {
  private path!: RegExp;

  public match!: (url?: string) => boolean;

  public constructor(path: RegExp) {
    this.setPath(path);
  }

  /**
   * Set path
   */
  public setPath(path: RegExp): this {
    this.path = path;
    
    return this;
  }

  /**
   * Configure Path
   */
  public mount(): void {
    this.match = (url: string = Chars.Slash): boolean => {
      const result = this.path.exec(url);

      if (result) {
        return true;
      }
      else {
        return false;
      }      
    };
  }
}

export default PathRegExp;
