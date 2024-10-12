import path from "path";
export default (args, inputFilePath, config) => {
    const fileAsList = inputFilePath.split("/");
    const fileListHead = fileAsList.slice(0, -1);
    const fname = fileAsList[fileAsList.length - 1];
    const fnameOnly = fname.split(".").slice(0, -1).join(".");
    const htmlFile = [config.outdir, ...fileListHead, `${fnameOnly}.html`].join("/");
    const jsFile = path.resolve(htmlFile.split(".html")[0] + ".mjs");
    return {
        script: `yarn electron node_modules/testeranto/dist/common/electron.js ${htmlFile} '${JSON.stringify({
            scheduled: true,
            name: inputFilePath,
            ports: [],
            fs: path.resolve(process.cwd(), config.outdir, inputFilePath),
        })}'`,
        name: inputFilePath,
        autorestart: false,
        args,
        watch: [jsFile],
    };
};
