
/**
 * Remove prefix
 * @example
 * removePrefix("/bar", "/") // returns "bar"
 */
function removePrefix(value: string, prefix: string): string {
  return value.startsWith(prefix)
    ? value.slice(prefix.length)
    : value;
}

export default removePrefix;