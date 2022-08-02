import type MatchParams  from "./MatchParams.js";
import type MatchPartial from "./MatchPartial.js";


type Match =
  | MatchParams
  | MatchPartial 
  | boolean;

export default Match;