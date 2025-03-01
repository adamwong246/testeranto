export default (config) => {
    return {
        bundle: true,
        entryPoints: [config.features],
        minify: config.minify === true,
        outbase: config.outbase,
        write: true,
        outfile: `${config.outdir}/tests.test.js`,
        // external: ["graphology"]
    };
};
