import { DirectedGraph, UndirectedGraph } from 'graphology';
declare abstract class TesterantoGraph {
    name: string;
    abstract graph: any;
    constructor(name: string);
}
export declare class TesterantoGraphUndirected implements TesterantoGraph {
    name: string;
    graph: UndirectedGraph;
    constructor(name: string);
    connect(a: any, b: any, relation?: string): void;
}
export declare class TesterantoGraphDirected implements TesterantoGraph {
    name: string;
    graph: DirectedGraph;
    constructor(name: string);
    connect(to: any, from: any, relation?: string): void;
}
export declare class TesterantoGraphDirectedAcylic implements TesterantoGraph {
    name: string;
    graph: DirectedGraph;
    constructor(name: string);
    connect(to: any, from: any, relation?: string): void;
}
export declare class TesterantoFeatures {
    features: any;
    entryPath: string;
    graphs: {
        undirected: TesterantoGraphUndirected[];
        directed: TesterantoGraphDirected[];
        dags: TesterantoGraphDirectedAcylic[];
    };
    constructor(features: any, graphs: {
        undirected: TesterantoGraphUndirected[];
        directed: TesterantoGraphDirected[];
        dags: TesterantoGraphDirectedAcylic[];
    }, entryPath: string);
    networks(): (TesterantoGraphUndirected | TesterantoGraphDirected | TesterantoGraphDirectedAcylic)[];
    toObj(): {
        features: any;
        networks: ({
            name: string;
            graph: UndirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
        } | {
            name: string;
            graph: DirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
        } | {
            name: string;
            graph: DirectedGraph<import("graphology-types").Attributes, import("graphology-types").Attributes, import("graphology-types").Attributes>;
        })[];
    };
    builder(): void;
}
export {};
