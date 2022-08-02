import type {JSONValue} from "@hyper/utility-types";

type Body =
  | Blob 
  | BufferSource 
  | FormData 
  | JSONValue;

export default Body;
