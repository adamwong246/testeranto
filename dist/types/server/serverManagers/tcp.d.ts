/**
 * Constants for Server_TCP configuration
 */
export declare const SERVER_CONSTANTS: {
    HOST: "0.0.0.0";
};
export declare const CONTENT_TYPES: {
    PLAIN: "text/plain";
    HTML: "text/html";
    JAVASCRIPT: "application/javascript";
    CSS: "text/css";
    JSON: "application/json";
    PNG: "image/png";
    JPEG: "image/jpeg";
    GIF: "image/gif";
    SVG: "image/svg+xml";
    ICO: "image/x-icon";
    WOFF: "font/woff";
    WOFF2: "font/woff2";
    TTF: "font/ttf";
    EOT: "application/vnd.ms-fontobject";
    XML: "application/xml";
    PDF: "application/pdf";
    ZIP: "application/zip";
    OCTET_STREAM: "application/octet-stream";
};
export declare function getContentType(filePath: string): string;
