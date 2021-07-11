import type Match from "./Match";
import type PathOptions from "./PathIOptions";

interface Path {
  match: (url?: string) => Match;
  mount: (
    options: PathOptions,
  ) => void;
}

export default Path;
