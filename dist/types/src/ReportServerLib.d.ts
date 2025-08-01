import http from "http";
export declare const ReportServerOfPort: (port: number) => http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
