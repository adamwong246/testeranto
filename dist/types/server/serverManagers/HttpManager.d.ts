export declare class HttpManager {
    routeName(req: any): string;
    decodedPath(req: any): string;
    matchRoute(routeName: string, routes: Record<string, any>): {
        handler: any;
        params: Record<string, string>;
    } | null;
    extractParams(pattern: string, routeName: string): Record<string, string> | null;
}
