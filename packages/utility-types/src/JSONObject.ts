/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import type JSONValue from "./JSONValue.js";

interface JSONObject {
  [key: string]: JSONValue;
}

export default JSONObject;
