import { convertNaming, getRgbStringFromFigmaColor } from './utils'

figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "create-rectangles") {
    const nodes = [];

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  } else if (msg.type === 'export-css') {
    const solidPaints = figma.getLocalPaintStyles().filter((paintStyle) => {
      let color = paintStyle.paints[0];
      return color.type === "SOLID";
    });

    const outputText = solidPaints.map(p =>
      convertNaming(p.name, msg.prefix) + ": " + getRgbStringFromFigmaColor((p.paints[0] as SolidPaint).color) + ";"
    ).sort()

    figma.ui.postMessage({ type: "generated", data: { outputText } });
  }
};
