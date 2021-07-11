import type JSONValue from "@hyper/utility-types/lib/JSONValue";

type Body =
  | Blob 
  | BufferSource 
  | FormData 
  | JSONValue;

export default Body;
