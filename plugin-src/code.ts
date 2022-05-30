import { PostToFigmaMessage, PostToUIMessage } from '../shared-src/messages';
import { convertNaming, getHexStringFromFigmaColor, getRgbStringFromFigmaColor } from "./utils";

figma.showUI(__html__, { themeColors: true, height: 500, width: 400 });

figma.ui.onmessage = (msg: PostToFigmaMessage) => {
  if (msg.type === "export-css") {
    const solidPaints = figma.getLocalPaintStyles().filter((paintStyle) => {
      let color = paintStyle.paints[0];
      return color.type === "SOLID";
    });

    const convertFn = msg.format === 'RGB' ? getRgbStringFromFigmaColor : getHexStringFromFigmaColor;

    const outputText = solidPaints
      .map(
        (p) =>
          convertNaming(p.name, msg.prefix) +
          ": " +
          convertFn((p.paints[0] as SolidPaint).color) +
          ";"
      )
      .sort();

    figma.ui.postMessage({ type: "generated", data: outputText } as PostToUIMessage);
  }
};
