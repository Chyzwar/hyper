
const splitChars = ";";


function tryDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  }
  catch {
    return str;
  }
}

/**
 * Parse a cookie header.
 */
function parseCookie(cookie: string): Record<string, string> {
  const result: Record<string, string> = {};
  
  if (!cookie) {
    return result;
  }

  for (const part of cookie.split(splitChars)) {
    const [key, value] = part.split("=");

    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    if (trimmedKey && trimmedValue) {
      result[trimmedKey] = tryDecode(trimmedValue);
    }
  }

  return result;
}


export default parseCookie;