"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = {
    name: "feature-markdown",
    setup(build) {
        build.onResolve({ filter: /\.md$/ }, (args) => {
            if (args.resolveDir === "")
                return;
            return {
                path: path_1.default.isAbsolute(args.path)
                    ? args.path
                    : path_1.default.join(args.resolveDir, args.path),
                namespace: "feature-markdown",
            };
        });
        build.onLoad({ filter: /.*/, namespace: "feature-markdown" }, async (args) => {
            // const markdownContent = new TextDecoder().decode(
            //   await fs.readFileSync(args.path)
            // );
            // markdownHTML = marked(markdownContent, options?.markedOptions);
            return {
                contents: `file://${args.path}`,
                loader: "text",
                // contents: JSON.stringify({ path: args.path }),
                // loader: "json",
                // contents: JSON.stringify({
                //   // html: markdownHTML,
                //   raw: markdownContent,
                //   filename: args.path, //path.basename(args.path),
                // }),
                // loader: "json",
            };
        });
    },
};
