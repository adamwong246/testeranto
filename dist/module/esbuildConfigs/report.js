export default (config) => {
    return {
        bundle: true,
        entryPoints: ["./node_modules/testeranto/dist/module/report.js"],
        minify: config.minify === true,
        outbase: config.outbase,
        write: true,
        outfile: `${config.outdir}/report.js`,
        external: ["tests.json", "features.test.js"],
    };
};
