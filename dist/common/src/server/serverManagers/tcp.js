"use strict";
// Do not allow imports from outside the project
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTENT_TYPES = exports.SERVER_CONSTANTS = void 0;
exports.getContentType = getContentType;
/**
 * Constants for Server_TCP configuration
 */
exports.SERVER_CONSTANTS = {
    HOST: "0.0.0.0",
};
exports.CONTENT_TYPES = {
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
function getContentType(filePath) {
    if (filePath.endsWith(".html"))
        return exports.CONTENT_TYPES.HTML;
    else if (filePath.endsWith(".js") || filePath.endsWith(".mjs"))
        return exports.CONTENT_TYPES.JAVASCRIPT;
    else if (filePath.endsWith(".css"))
        return exports.CONTENT_TYPES.CSS;
    else if (filePath.endsWith(".json"))
        return exports.CONTENT_TYPES.JSON;
    else if (filePath.endsWith(".png"))
        return exports.CONTENT_TYPES.PNG;
    else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
        return exports.CONTENT_TYPES.JPEG;
    else if (filePath.endsWith(".gif"))
        return exports.CONTENT_TYPES.GIF;
    else if (filePath.endsWith(".svg"))
        return exports.CONTENT_TYPES.SVG;
    else
        return exports.CONTENT_TYPES.PLAIN;
}
