export declare enum ApiFilename {
    "root" = "./testeranto/index.html",
    "style" = "./testeranto/App.css",
    "script" = "./testeranto/App.js"
}
export declare const Api: {
    testeranto: {
        api: {
            tests: string;
            report: string;
            files: string;
        };
        app: {
            projects: {
                urls: string;
                files: string;
            };
            root: {
                url: string;
                file: string;
            };
            css: {
                url: string;
                file: string;
            };
            script: {
                url: string;
                file: string;
            };
        };
    };
};
export declare enum ApiEndpoint {
    root = "/testeranto/index.html",
    style = "/testeranto/App.css",
    script = "/testeranto/App.js"
}
