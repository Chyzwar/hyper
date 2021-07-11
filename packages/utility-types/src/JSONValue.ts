import type JSONPrimitive from "./JSONPrimitive.js";
import type JSONArray from "./JSONArray.js";
import type JSONObject from "./JSONObject.js";

type JSONValue =
  | JSONArray 
  | JSONObject 
  | JSONPrimitive;

export default JSONValue;
