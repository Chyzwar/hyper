/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import Charset from "./Charset.js";
import ContentType from "./ContentType.js";
import ContentTypes from "./ContentType.js";

/**
 * List of supported text types
 */
const textTypes = [
  "text/html",
  "text/plain",
  "text/xml",
  "application/json",
  "application/x-www-form-urlencoded",
];

const commaSplit = /\s*;\s*/;
const equalSplit = /\s*=\s*/;

export interface Content {
  type: string;
  params: {
    charset: Charset;
  };
}

const jsonType: Readonly<Content> = {
  type: ContentType.ApplicationJSON,
  params: {charset: Charset.UTF8},
};

const textPlain: Readonly<Content> = {
  type: ContentType.TextPlain,
  params: {charset: Charset.UTF8},
};

/**
 * Parse content-type header, do not follow rfc
 * Handle just simple cases
 *
 * @example
 * getContentType("application/json; charset=UTF-8")
 * {
 *  type: "application/json",
 *  params: { charset: "UTF-8" }
 * }
 */
function getContentType(value: string): Readonly<Content> {
  switch (value) {
    case ContentTypes.ApplicationJSON:
      return jsonType;
    case ContentTypes.TextPlain:
      return textPlain; 
    default: {
      const [type, params] = value.split(commaSplit) as [ContentType, string | undefined];
  
      if (textTypes.includes(type)) {
        if (params?.startsWith("charset")) {
          const [
            , charset = Charset.UTF8,
          ] = params.split(equalSplit) as [string, Charset];

          return {
            type,
            params: {charset},
          };
        }
        else {
          return {
            type,
            params: {charset: Charset.UTF8},
          };
        }
      }

      throw new Error(`Unsupported content type: ${type}`);
    }
  }
}

export default getContentType;