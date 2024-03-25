import pkg from "graphology";
/* @ts-ignore:next-line */
const { DirectedGraph, UndirectedGraph } = pkg;
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
export class TesterantoFeatures {
    constructor(features, graphs) {
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
                return Object.assign(Object.assign({}, feature), { inNetworks: this.networks()
                        .filter((network) => {
                        return network.graph.hasNode(feature.name);
                    })
                        .map((network) => {
                        return {
                            network: network.name,
                            neighbors: network.graph.neighbors(feature.name),
                        };
                    }) });
            }),
            networks: this.networks().map((network) => {
                return Object.assign({}, network);
            }),
        };
    }
}
export { DirectedGraph };
export default {};
