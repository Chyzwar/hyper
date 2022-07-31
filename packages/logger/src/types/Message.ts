import type {JSONObject} from "@hyper/utility-types";

import type Level from "../enums/Level.js";

interface Message extends JSONObject {
  level: Level;
  time: string;
  message: string;
}

export default Message;