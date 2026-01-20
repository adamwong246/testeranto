// Do not allow imports from outside the project

/**
 * Constants for Server_TCP configuration
 */

export const SERVER_CONSTANTS = {
  HOST: "0.0.0.0" as const,
};

export const CONTENT_TYPES = {
  PLAIN: "text/plain" as const,
  HTML: "text/html" as const,
  JAVASCRIPT: "application/javascript" as const,
  CSS: "text/css" as const,
  JSON: "application/json" as const,
  PNG: "image/png" as const,
  JPEG: "image/jpeg" as const,
  GIF: "image/gif" as const,
  SVG: "image/svg+xml" as const,
  ICO: "image/x-icon" as const,
  WOFF: "font/woff" as const,
  WOFF2: "font/woff2" as const,
  TTF: "font/ttf" as const,
  EOT: "application/vnd.ms-fontobject" as const,
  XML: "application/xml" as const,
  PDF: "application/pdf" as const,
  ZIP: "application/zip" as const,
  OCTET_STREAM: "application/octet-stream" as const,
};


export function getContentType(filePath: string): string {
  if (filePath.endsWith(".html")) return CONTENT_TYPES.HTML;
  else if (filePath.endsWith(".js") || filePath.endsWith(".mjs"))
    return CONTENT_TYPES.JAVASCRIPT;
  else if (filePath.endsWith(".css")) return CONTENT_TYPES.CSS;
  else if (filePath.endsWith(".json")) return CONTENT_TYPES.JSON;
  else if (filePath.endsWith(".png")) return CONTENT_TYPES.PNG;
  else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
    return CONTENT_TYPES.JPEG;
  else if (filePath.endsWith(".gif")) return CONTENT_TYPES.GIF;
  else if (filePath.endsWith(".svg")) return CONTENT_TYPES.SVG;
  else return CONTENT_TYPES.PLAIN;
}
