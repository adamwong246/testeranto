"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectedGraph = exports.TesterantoFeatures = exports.TesterantoGraphDirectedAcyclic = exports.TesterantoGraphDirected = exports.TesterantoGraphUndirected = exports.BaseFeature = void 0;
const graphology_umd_js_1 = __importDefault(require("graphology/dist/graphology.umd.js"));
const { DirectedGraph, UndirectedGraph } = graphology_umd_js_1.default;
exports.DirectedGraph = DirectedGraph;
class TesterantoGraph {
    constructor(name) {
        this.name = name;
    }
}
class BaseFeature {
    constructor(name) {
        this.name = name;
    }
}
exports.BaseFeature = BaseFeature;
class TesterantoGraphUndirected {
    constructor(name) {
        this.name = name;
        this.graph = new UndirectedGraph();
    }
    connect(a, b, relation) {
        this.graph.mergeEdge(a, b, { type: relation });
    }
}
exports.TesterantoGraphUndirected = TesterantoGraphUndirected;
class TesterantoGraphDirected {
    constructor(name) {
        this.name = name;
        this.graph = new DirectedGraph();
    }
    connect(to, from, relation) {
        this.graph.mergeEdge(to, from, { type: relation });
    }
}
exports.TesterantoGraphDirected = TesterantoGraphDirected;
class TesterantoGraphDirectedAcyclic {
    constructor(name) {
        this.name = name;
        this.graph = new DirectedGraph();
    }
    connect(to, from, relation) {
        this.graph.mergeEdge(to, from, { type: relation });
    }
}
exports.TesterantoGraphDirectedAcyclic = TesterantoGraphDirectedAcyclic;
class TesterantoFeatures {
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
exports.TesterantoFeatures = TesterantoFeatures;
exports.default = {};
