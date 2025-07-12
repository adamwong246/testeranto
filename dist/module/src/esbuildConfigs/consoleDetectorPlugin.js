export const consoleDetectorPlugin = {
    name: 'console-detector',
    setup(build) {
        build.onLoad({ filter: /\.(js|ts)$/ }, async (args) => {
            const contents = await require('fs').promises.readFile(args.path, 'utf8');
            const consolePattern = /console\.(log|error|warn|info|debug|trace|dir|dirxml|table|group|groupEnd|clear|count|countReset|assert|profile|profileEnd|time|timeLog|timeEnd|timeStamp|context|memory)/g;
            const matches = contents.match(consolePattern);
            if (matches) {
                const uniqueMethods = [...new Set(matches)];
                return {
                    warnings: uniqueMethods.map(method => ({
                        text: `Detected ${method} call - Pure runtime does not allow IO operations. Use Node runtime instead.`,
                        location: {
                            file: args.path,
                            line: contents.split('\n').findIndex(line => line.includes(method)) + 1,
                            column: 0
                        }
                    }))
                };
            }
            return null;
        });
    }
};
