import Graph, { DirectedGraph, UndirectedGraph } from 'graphology';

import { BaseFeature } from "../src/BaseClasses";

abstract class TesterantoGraph {
  name: string;
  abstract graph;

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
    this.graph = new DirectedGraph();
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
    this.graph = new DirectedGraph();
  }
  connect(to, from, relation?: string) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
}

export class TesterantoFeatures {
  features: any;
  graphs: {
    undirected: TesterantoGraphUndirected[],
    directed: TesterantoGraphDirected[],
    dags: TesterantoGraphDirectedAcylic[]
  }

  constructor(
    features,
    graphs: {
      undirected: TesterantoGraphUndirected[],
      directed: TesterantoGraphDirected[],
      dags: TesterantoGraphDirectedAcylic[]
    }
  ) {
    this.features = features;
    this.graphs = graphs;
  }

  networks() {
    return [
      ...this.graphs.undirected.values(),
      ...this.graphs.directed.values(),
      ...this.graphs.dags.values()
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

}
