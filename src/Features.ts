import pkg from "graphology";

/* @ts-ignore:next-line */
const { DirectedGraph, UndirectedGraph } = pkg;

abstract class TesterantoGraph {
  name: string;
  abstract graph;

  constructor(name: string) {
    this.name = name;
  }
}

export class BaseFeature {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export class TesterantoGraphUndirected implements TesterantoGraph {
  name: string;
  graph: typeof UndirectedGraph;
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
  graph: typeof DirectedGraph;
  constructor(name: string) {
    this.name = name;
    this.graph = new DirectedGraph();
  }
  connect(to, from, relation?: string) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
}

export class TesterantoGraphDirectedAcyclic implements TesterantoGraph {
  name: string;
  graph: typeof DirectedGraph;
  constructor(name: string) {
    this.name = name;
    this.graph = new DirectedGraph();
  }
  connect(to, from, relation?: string) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
}

export class TesterantoFeatures {
  features: Record<string, BaseFeature>;
  graphs: {
    undirected: TesterantoGraphUndirected[];
    directed: TesterantoGraphDirected[];
    dags: TesterantoGraphDirectedAcyclic[];
  };

  constructor(
    features: Record<string, BaseFeature>,
    graphs: {
      undirected: TesterantoGraphUndirected[];
      directed: TesterantoGraphDirected[];
      dags: TesterantoGraphDirectedAcyclic[];
    }
  ) {
    this.features = features;
    this.graphs = graphs;
  }

  networks() {
    return [
      ...this.graphs.undirected.values(),
      ...this.graphs.directed.values(),
      ...this.graphs.dags.values(),
    ];
  }

  toObj() {
    return {
      features: Object.entries(this.features).map(([name, feature]) => {
        return {
          ...feature,
          inNetworks: this.networks()
            .filter((network) => {
              return network.graph.hasNode(feature.name);
            })
            .map((network) => {
              return {
                network: network.name,
                neighbors: network.graph.neighbors(feature.name),
              };
            }),
        };
      }),
      networks: this.networks().map((network) => {
        return {
          ...network,
        };
      }),
    };
  }
}

export type IT_FeatureNetwork = {
  name: string;
  // graph: DirectedGraph
};

export { DirectedGraph };

export default {};
