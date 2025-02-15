import Graph from "graphology/dist/graphology.umd.js";

const { DirectedGraph, UndirectedGraph } = Graph;

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
  graph: Graph;
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
  graph: Graph;
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
  graph: Graph;
  constructor(name: string) {
    this.name = name;
    this.graph = new DirectedGraph();
  }
  connect(to, from, relation?: string) {
    this.graph.mergeEdge(to, from, { type: relation });
  }
}

export type IT_FeatureNetwork = {
  name: string;
  // graph: DirectedGraph
};

export { DirectedGraph };

export default {};
