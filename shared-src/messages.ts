export type GeneratedToUIMessage = {
  type: "generated";
  data: string[];
};

export type PostToUIMessage =
  | GeneratedToUIMessage;

export const ExportColorAllFormats = ['RGB', 'HEX'] as const;
export type ExportColorFormat = typeof ExportColorAllFormats[number];

export type ExportCssToFigmaMessage = {
  type: "export-css";
  prefix: string;
  format: ExportColorFormat;
};

export type PostToFigmaMessage =
  | ExportCssToFigmaMessage;