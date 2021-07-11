import type HeaderName from "./HeaderName.js";
import type ContentType from "./ContentType.js";
import type UserAgent from "./UserAgent.js";
import type ContentEncoding from "./ContentEncoding.js";

interface Headers {
  [HeaderName.ContentType]?: ContentType;
  [HeaderName.UserAgent]?: UserAgent;
  [HeaderName.ContentEncoding]?: ContentEncoding;
  [HeaderName.MaxForwards]?: string;
  [HeaderName.ContentLength]?: string;
  
  [key: string]: string | undefined;
}

export default Headers ;
