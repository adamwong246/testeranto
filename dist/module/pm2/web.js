import path from "path";
export default (args, inputFilePath, watch, config) => {
    const htmlFileAndQueryParams = `file://${path.resolve(watch)}\?requesting='${encodeURIComponent(JSON.stringify({
        scheduled: true,
        name: inputFilePath,
        ports: [],
        fs: path.resolve(process.cwd(), config.outdir, "web", inputFilePath),
    }))}`;
    return {
        script: `chromium --allow-file-access-from-files --allow-file-access --allow-cross-origin-auth-prompt ${htmlFileAndQueryParams}' --load-extension=./node_modules/testeranto/dist/chromeExtension`,
        name: inputFilePath,
        autorestart: false,
        args,
        watch: [watch],
    };
};
