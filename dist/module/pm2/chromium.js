import path from "path";
export default (args, inputFilePath, config) => {
    const fileAsList = inputFilePath.split("/");
    const fileListHead = fileAsList.slice(0, -1);
    const fname = fileAsList[fileAsList.length - 1];
    const fnameOnly = fname.split(".").slice(0, -1).join(".");
    const htmlFile = [config.outdir, ...fileListHead, `${fnameOnly}.html`].join("/");
    const jsFile = path.resolve(htmlFile.split(".html")[0] + ".mjs");
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
        watch: [jsFile],
    };
};
