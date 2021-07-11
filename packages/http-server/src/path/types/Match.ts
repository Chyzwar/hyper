import type MatchParams  from "./MatchParams";
import type MatchPartial from "./MatchPartial";


type Match =
  | MatchParams
  | MatchPartial 
  | boolean;

export default Match;