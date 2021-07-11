/**
 * Add suffix if not already suffixed
 * @example
 * suffixWith("/bar", "/") // returns "/bar/"
 */
function suffixWith(value: string, suffix: string): string {
  return value.endsWith(suffix)
    ? value
    : value + suffix;
}

export default suffixWith;