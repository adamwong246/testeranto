import Graph, { DirectedGraph, UndirectedGraph } from 'graphology';
import { createHash } from 'node:crypto'
import esbuild from "esbuild";
import fs from "fs";
import path from "path";

import { BaseFeature } from "../src/BaseClasses";

abstract class TesterantoGraph {
  name: string;
  graph: Graph;
  constructor(name: string) {
    this.name = name;
  }
}

export class TesterantoGraphUndirected implements TesterantoGraph {
  name: string;
  graph: UndirectedGraph
  constructor(name: string) {
    this.name = name;
    this.graph = new UndirectedGraph();
  }
  connect(a, b, relation?: string) {
    this.graph.mergeEdge(a, b, { type: relation });
  }
}

export class TesterantoGraphDirected implements TesterantoGraph {
  name: string;
  graph: DirectedGraph;
  constructor(name: string) {
    this.name = name;
    this.graph = new UndirectedGraph();
  }
  connect(to, from, relation?: string) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
}

export class TesterantoGraphDirectedAcylic implements TesterantoGraph {
  name: string;
  graph: DirectedGraph;
  constructor(name: string) {
    this.name = name;
    this.graph = new UndirectedGraph();
  }
  connect(to, from, relation?: string) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
}

export class TesterantoFeatures {
  features: any;
  entryPath: string
  graphs: {
    undirected: TesterantoGraphUndirected[],
    directed: TesterantoGraphDirected[],
    dag: TesterantoGraphDirectedAcylic[]
  }

  constructor(
    features,
    graphs: {
      undirected: TesterantoGraphUndirected[],
      directed: TesterantoGraphDirected[],
      dag: TesterantoGraphDirectedAcylic[]
    },
    entryPath: string,
  ) {
    this.features = features;
    this.entryPath = entryPath;
    this.graphs = graphs;
  }

  networks() {
    return [
      ...this.graphs.undirected.values(),
      ...this.graphs.directed.values(),
      ...this.graphs.dag.values()
    ]
  }

  toObj() {
    return {
      features: this.features.map((feature: BaseFeature) => {
        return {
          ...feature,
          inNetworks: this.networks().filter((network) => {
            return network.graph.hasNode(feature.name);
          }).map((network) => {
            return {

              network: network.name,
              neighbors: network.graph.neighbors(feature.name)
            }
          })
        }
      }),
      networks: this.networks().map((network) => {
        return {
          ...network
        }
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
            x = x + ".ts"
          }
          return { path: x, external: true }
        })
      },
    }
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
      const p = "./dist" + (this.entryPath.split(process.cwd()).pop())?.split(".ts")[0] + '.js'
      fs.promises.mkdir(path.dirname(p), { recursive: true }).then(x => {
        fs.promises.writeFile(p, text);
        fs.promises.writeFile("./dist" + (this.entryPath.split(process.cwd()).pop())?.split(".ts")[0] + `.md5`, createHash('md5').update(text).digest('hex'))
      })
    });
  }

}
