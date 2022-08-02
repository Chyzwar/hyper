import type Match from "./Match.js";
import type PathOptions from "./PathIOptions.js";

interface Path {
  match: (url?: string) => Match;
  mount: (
    options: PathOptions,
  ) => void;
}

export default Path;
