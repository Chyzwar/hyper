import {parse} from "url";
import type {UrlWithParsedQuery} from "url";

const parseQueryString = true;
const slashesDenoteHost = false;

const defaultUrl = parse(
  "/",         
  parseQueryString,
  slashesDenoteHost
);

function parseURL(reqUrl?: string): UrlWithParsedQuery {
  if (!reqUrl) {
    return defaultUrl;
  }

  try {
    const decodedUrl = decodeURIComponent(reqUrl);
  
    return parse(
      decodedUrl,
      parseQueryString,
      slashesDenoteHost
    );    
  }
  catch {
    return defaultUrl; 
  }
}

export default parseURL;