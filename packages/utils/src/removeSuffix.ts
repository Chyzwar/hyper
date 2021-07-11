
/**
 * Remove suffix
 * @example
 * removeSuffix("/bar", "/") // returns "/bar"
 */
function removeSuffix(value: string, suffix: string): string {
  return value.endsWith(suffix)
    ? value.slice(0, - suffix.length)
    : value;
}

export default removeSuffix;