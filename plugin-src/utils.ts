// Figma uses slashes for grouping styles together. This turns that slash into a dash
export function convertNaming(name: string, prefix?: string) {
  return '--' + (prefix || '') + name
    .trim().toLowerCase()
    .replace(new RegExp("/", "gm"), "-") // Figma group is separated by "/"
    .replace(new RegExp("\\s+", "gm"), "") // Remove any spaces in each subpart
}