import Graph from "graphology/dist/graphology.umd.js";
const { DirectedGraph, UndirectedGraph } = Graph;
class TesterantoGraph {
    constructor(name) {
        this.name = name;
    }
}
export class BaseFeature {
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
export class TesterantoGraphDirectedAcyclic {
    constructor(name) {
        this.name = name;
        this.graph = new DirectedGraph();
    }
    connect(to, from, relation) {
        this.graph.mergeEdge(to, from, { type: relation });
    }
}
export { DirectedGraph };
export default {};
