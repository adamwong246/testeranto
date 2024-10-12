import path from "path";
export default (args, inputFilePath, config, watch) => {
    return {
        name: inputFilePath,
        script: `node ${config.debugger ? "--inspect-brk" : ""} ${watch} '${JSON.stringify({
            scheduled: true,
            name: inputFilePath,
            ports: [],
            fs: path.resolve(process.cwd(), config.outdir, "node", inputFilePath),
        })}'`,
        autorestart: false,
        watch: [watch],
        args
    };
};
