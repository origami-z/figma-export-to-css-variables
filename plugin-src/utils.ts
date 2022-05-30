/**
 * Figma uses slashes for grouping styles together. This turns that slash into a dash.
 **/
export function convertNaming(name: string, prefix?: string) {
  return '--' + (prefix || '') + name
    .trim().toLowerCase()
    .replace(new RegExp("/", "gm"), "-") // Figma group is separated by "/"
    .replace(new RegExp("\\s+", "gm"), "") // Remove any spaces in each subpart
}

/**
 * Figma stores the color value as a 0 to 1 decimal instead of 0 to 255.
 **/
export function color1To255(colorValue: number) {
  return Math.round(colorValue * 255);
}

export function getRgbStringFromFigmaColor(rgb: RGB) {
  return `rgb(${color1To255(rgb.r)}, ${color1To255(rgb.g)}, ${color1To255(rgb.b)})`;
}

function componentToHex(c: number) {
  var hex = c.toString(16).toUpperCase();
  return hex.length == 1 ? "0" + hex : hex;
}

export function getHexStringFromFigmaColor({ r, g, b }: RGB) {
  return "#" + componentToHex(color1To255(r)) + componentToHex(color1To255(g)) + componentToHex(color1To255(b));
}