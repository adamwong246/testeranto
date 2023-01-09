import { DirectedGraph, UndirectedGraph } from 'graphology';
import { createHash } from 'node:crypto';
import esbuild from "esbuild";
import fs from "fs";
import path from "path";
class TesterantoGraph {
    constructor(name) {
        this.name = name;
    }
}
export class TesterantoGraphUndirected {
    constructor(name) {
        this.name = name;
        this.graph = new UndirectedGraph();
    }
    connect(a, b, relation) {
        this.graph.mergeEdge(a, b, { type: relation });
    }
}
export class TesterantoGraphDirected {
    constructor(name) {
        this.name = name;
        this.graph = new DirectedGraph();
    }
    connect(to, from, relation) {
        this.graph.mergeEdge(to, from, { type: relation });
    }
}
export class TesterantoGraphDirectedAcylic {
    constructor(name) {
        this.name = name;
        this.graph = new DirectedGraph();
    }
    connect(to, from, relation) {
        this.graph.mergeEdge(to, from, { type: relation });
    }
}
export class TesterantoFeatures {
    constructor(features, graphs, entryPath) {
        this.features = features;
        this.entryPath = entryPath;
        this.graphs = graphs;
    }
    networks() {
        return [
            ...this.graphs.undirected.values(),
            ...this.graphs.directed.values(),
            ...this.graphs.dags.values()
        ];
    }
    toObj() {
        return {
            features: this.features.map((feature) => {
                return Object.assign(Object.assign({}, feature), { inNetworks: this.networks().filter((network) => {
                        return network.graph.hasNode(feature.name);
                    }).map((network) => {
                        return {
                            network: network.name,
                            neighbors: network.graph.neighbors(feature.name)
                        };
                    }) });
            }),
            networks: this.networks().map((network) => {
                return Object.assign({}, network);
            })
        };
    }
    builder() {
        const importPathPlugin = {
            name: 'import-path',
            setup(build) {
                build.onResolve({ filter: /^\.{1,2}\// }, args => {
                    let x = args.resolveDir + "/" + args.path;
                    if (x.split(".ts").length > 1) {
                        x = x + ".ts";
                    }
                    return { path: x, external: true };
                });
            },
        };
        esbuild.build({
            entryPoints: [this.entryPath],
            bundle: true,
            minify: false,
            format: "esm",
            target: ["esnext"],
            write: false,
            packages: 'external',
            plugins: [importPathPlugin],
            external: ['./src/*', './tests/testerantoFeatures.test.ts'],
        }).then((res) => {
            const text = res.outputFiles[0].text;
            console.log("mark 0", this.entryPath, process.cwd());
            // const p = process.cwd() + "./dist/tests/testerantoFeatures.test.js";
            // +
            //   (this.entryPath.split(process.cwd()).pop())?.split(".ts")[0]
            //   + '.js'
            fs.promises.mkdir(path.dirname(process.cwd() + "./dist/tests"), { recursive: true }).then(x => {
                console.log("mark 1", process.cwd() + "/dist/tests/testerantoFeatures.test.js");
                fs.promises.writeFile(process.cwd() + "/dist/tests/testerantoFeatures.test.js", text);
                fs.promises.writeFile(
                // "./dist" + (this.entryPath.split(process.cwd()).pop())?.split(".ts")[0] + `.md5`,
                process.cwd() + "/dist/tests/testerantoFeatures.test.md5", createHash('md5').update(text).digest('hex'));
            });
        });
    }
}