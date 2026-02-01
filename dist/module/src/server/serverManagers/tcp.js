// Do not allow imports from outside the project
/**
 * Constants for Server_TCP configuration
 */
export const SERVER_CONSTANTS = {
    HOST: "0.0.0.0",
};
export const CONTENT_TYPES = {
    PLAIN: "text/plain",
    HTML: "text/html",
    JAVASCRIPT: "application/javascript",
    CSS: "text/css",
    JSON: "application/json",
    PNG: "image/png",
    JPEG: "image/jpeg",
    GIF: "image/gif",
    SVG: "image/svg+xml",
    ICO: "image/x-icon",
    WOFF: "font/woff",
    WOFF2: "font/woff2",
    TTF: "font/ttf",
    EOT: "application/vnd.ms-fontobject",
    XML: "application/xml",
    PDF: "application/pdf",
    ZIP: "application/zip",
    OCTET_STREAM: "application/octet-stream",
};
export function getContentType(filePath) {
    if (filePath.endsWith(".html"))
        return CONTENT_TYPES.HTML;
    else if (filePath.endsWith(".js") || filePath.endsWith(".mjs"))
        return CONTENT_TYPES.JAVASCRIPT;
    else if (filePath.endsWith(".css"))
        return CONTENT_TYPES.CSS;
    else if (filePath.endsWith(".json"))
        return CONTENT_TYPES.JSON;
    else if (filePath.endsWith(".png"))
        return CONTENT_TYPES.PNG;
    else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
        return CONTENT_TYPES.JPEG;
    else if (filePath.endsWith(".gif"))
        return CONTENT_TYPES.GIF;
    else if (filePath.endsWith(".svg"))
        return CONTENT_TYPES.SVG;
    else
        return CONTENT_TYPES.PLAIN;
}
