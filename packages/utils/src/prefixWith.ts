

/**
 * Add prefix if not already prefixed
 * @example
 * prefixWith("bar", "/") // returns "/bar"
 */
function prefixWith(value: string, prefix: string): string {
  return value.startsWith(prefix)
    ? value
    : prefix + value;
}

export default prefixWith;