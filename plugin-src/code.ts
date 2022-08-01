import { PluginCommandType, PostToFigmaMessage, PostToUIMessage } from "../shared-src/messages";
import {
  convertNaming,
  convertNamingFromGroup,
  getHexStringFromFigmaColor,
  getRgbStringFromFigmaColor,
  splitGroup,
  trimDefaultEnding,
} from "./utils";

type StyleRecursiveObj = {
  [key: string]: StyleRecursiveObj | string
}

const WINDOW_WIDTH = 400;
const CSS_VIEW_HEIGHT = 500;
const JSON_VIEW_HEIGHT = 432;

figma.showUI(__html__, { themeColors: true, height: CSS_VIEW_HEIGHT, width: WINDOW_WIDTH, title: (figma.command === 'export-css-var' ? "Export CSS Variables" : "Export JSON") });

figma.ui.onmessage = (msg: PostToFigmaMessage) => {
  if (msg.type === 'ui-ready') {
    const command = figma.command as PluginCommandType;
    figma.ui.resize(WINDOW_WIDTH, command === 'export-css-var' ? CSS_VIEW_HEIGHT : JSON_VIEW_HEIGHT)
    figma.ui.postMessage({
      type: "launch-view",
      command: command,
    } as PostToUIMessage);
  }
  else if (msg.type === "export-css") {
    const solidPaints = figma.getLocalPaintStyles().filter((paintStyle) => {
      let color = paintStyle.paints[0];
      return color.type === "SOLID";
    });

    // Alpha channel is ignored here
    const colorConvertFn =
      msg.format === "RGB"
        ? getRgbStringFromFigmaColor
        : getHexStringFromFigmaColor;

    let outputText: string[] = [];
    if (msg.ignoreFirstGroup) {
      // Group by first group section and put them into a comment line above
      const groupMap: Map<string, string[]> = new Map();
      solidPaints.forEach((p) => {
        const nameGroups = splitGroup(p.name);

        const groupName = nameGroups.length > 1 ? nameGroups[0] : "Ungrouped";
        if (nameGroups.length > 1) {
          nameGroups.shift();
        }
        const varName = convertNamingFromGroup(nameGroups, msg.prefix);
        const varNameAfterTrim = msg.ignoreDefaultEnding
          ? trimDefaultEnding(varName)
          : varName;
        const cssVarLine =
          varNameAfterTrim +
          ": " +
          colorConvertFn((p.paints[0] as SolidPaint).color) +
          ";";

        if (groupMap.has(groupName)) {
          groupMap.get(groupName)?.push(cssVarLine);
        } else {
          groupMap.set(groupName, [cssVarLine]);
        }
      });
      groupMap.forEach((keys, groupName) => {
        outputText.push(`/** ${groupName} */`);
        outputText.push(...keys);
      });
    } else {
      outputText = solidPaints
        .map((p) => {
          const varName = convertNaming(p.name, msg.prefix);
          const varNameAfterTrim = msg.ignoreDefaultEnding
            ? trimDefaultEnding(varName)
            : varName;
          return (
            varNameAfterTrim +
            ": " +
            colorConvertFn((p.paints[0] as SolidPaint).color) +
            ";"
          );
        })
        .sort();
    }

    figma.ui.postMessage({
      type: "generated",
      data: outputText.join("\n"),
    } as PostToUIMessage);
  } else if (msg.type === 'export-json') {

    const solidPaints = figma.getLocalPaintStyles().filter((paintStyle) => {
      let color = paintStyle.paints[0];
      return color.type === "SOLID";
    });

    // Alpha channel is ignored here
    const colorConvertFn =
      msg.format === "RGB"
        ? getRgbStringFromFigmaColor
        : getHexStringFromFigmaColor;

    const jsonObj: StyleRecursiveObj = {};
    console.log({ jsonObj })

    for (const p of solidPaints) {

      const parts = splitGroup(p.name);


      // Create sub-objects along path as needed
      let target = jsonObj;
      while (parts.length > 1) {
        const part = parts.shift();

        // @ts-expect-error
        target = target[part!] = target[part!] || {};
      }

      const value = colorConvertFn((p.paints[0] as SolidPaint).color);
      // Set value at end of path
      target[parts[0]] = value;

    }

    // console.log({ jsonObj })

    const result = JSON.stringify(jsonObj, null, 2);

    figma.ui.postMessage({
      type: "generated",
      data: result,
    } as PostToUIMessage);
  }
};
