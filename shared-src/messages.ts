export type GeneratedToUIMessage = {
  type: "generated";
  data: string[];
};

export type PostToUIMessage =
  | GeneratedToUIMessage;

export type ExportCssToFigmaMessage = {
  type: "export-css";
  prefix: string;
};

export type PostToFigmaMessage =
  | ExportCssToFigmaMessage;