export type GeneratedToUIMessage = {
  type: "generated";
  /** Each line of text */
  data: string[];
};

export type PostToUIMessage = GeneratedToUIMessage;

export const ExportColorAllFormats = ["RGB", "HEX"] as const;
export type ExportColorFormat = typeof ExportColorAllFormats[number];

export type ExportCssToFigmaMessage = {
  type: "export-css";
  prefix: string;
  format: ExportColorFormat;
  ignoreFirstGroup?: boolean;
  ignoreDefaultEnding?: boolean;
};

export type PostToFigmaMessage = ExportCssToFigmaMessage;
