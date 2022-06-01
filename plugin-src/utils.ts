/** Turns string into Camel case except full capital case */
export function camelize(str: string) {
  if (/^[A-Z]+$/.test(str.trim())) {
    return str.trim().toLowerCase();
  }
  return str.trim().replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/** Extract first part of the group name. e.g. `A/B/C` => `A` */
export function extractFirstGroup(name: string) {
  return name.split("/").shift()?.trim() || "";
}

/** Split name to each group and clean up leading and trailing spaces. */
export function splitGroup(name: string) {
  // Figma group is separated by "/"
  return name.split("/").map((x) => x.trim());
}

/**
 * Figma uses slashes for grouping styles together. This turns that slash into a dash.
 **/
export function convertNaming(name: string, prefix?: string) {
  return (
    "--" +
    (prefix || "") +
    name
      .toLowerCase()
      .split("/") // Figma group is separated by "/"
      .map(camelize)
      .join("-")
  );
}
export function convertNamingFromGroup(nameGroups: string[], prefix?: string) {
  return "--" + (prefix || "") + nameGroups.map(camelize).join("-");
}

/**
 * Figma stores the color value as a 0 to 1 decimal instead of 0 to 255.
 **/
export function color1To255(colorValue: number) {
  return Math.round(colorValue * 255);
}

export function getRgbStringFromFigmaColor(rgb: RGB) {
  return `rgb(${color1To255(rgb.r)}, ${color1To255(rgb.g)}, ${color1To255(
    rgb.b
  )})`;
}

function componentToHex(c: number) {
  var hex = c.toString(16).toUpperCase();
  return hex.length == 1 ? "0" + hex : hex;
}

export function getHexStringFromFigmaColor({ r, g, b }: RGB) {
  return (
    "#" +
    componentToHex(color1To255(r)) +
    componentToHex(color1To255(g)) +
    componentToHex(color1To255(b))
  );
}
