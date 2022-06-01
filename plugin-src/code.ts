import { PostToFigmaMessage, PostToUIMessage } from "../shared-src/messages";
import {
  convertNaming,
  convertNamingFromGroup,
  getHexStringFromFigmaColor,
  getRgbStringFromFigmaColor,
  splitGroup,
} from "./utils";

figma.showUI(__html__, { themeColors: true, height: 520, width: 400 });

figma.ui.onmessage = (msg: PostToFigmaMessage) => {
  if (msg.type === "export-css") {
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
        const cssVarLine =
          convertNamingFromGroup(nameGroups, msg.prefix) +
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
        .map(
          (p) =>
            convertNaming(p.name, msg.prefix) +
            ": " +
            colorConvertFn((p.paints[0] as SolidPaint).color) +
            ";"
        )
        .sort();
    }

    figma.ui.postMessage({
      type: "generated",
      data: outputText,
    } as PostToUIMessage);
  }
};
