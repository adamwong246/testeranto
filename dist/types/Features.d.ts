import Graph from "graphology/dist/graphology.umd.js";
declare const DirectedGraph: any;
declare abstract class TesterantoGraph {
    name: string;
    abstract graph: any;
    constructor(name: string);
}
export declare class BaseFeature {
    name: string;
    constructor(name: string);
}
export declare class TesterantoGraphUndirected implements TesterantoGraph {
    name: string;
    graph: Graph;
    constructor(name: string);
    connect(a: any, b: any, relation?: string): void;
}
export declare class TesterantoGraphDirected implements TesterantoGraph {
    name: string;
    graph: Graph;
    constructor(name: string);
    connect(to: any, from: any, relation?: string): void;
}
export declare class TesterantoGraphDirectedAcyclic implements TesterantoGraph {
    name: string;
    graph: Graph;
    constructor(name: string);
    connect(to: any, from: any, relation?: string): void;
}
export declare class TesterantoFeatures {
    features: Record<string, BaseFeature>;
    graphs: {
        undirected: TesterantoGraphUndirected[];
        directed: TesterantoGraphDirected[];
        dags: TesterantoGraphDirectedAcyclic[];
    };
    constructor(features: Record<string, BaseFeature>, graphs: {
        undirected: TesterantoGraphUndirected[];
        directed: TesterantoGraphDirected[];
        dags: TesterantoGraphDirectedAcyclic[];
    });
    networks(): (TesterantoGraphUndirected | TesterantoGraphDirected | TesterantoGraphDirectedAcyclic)[];
    toObj(): {
        features: {
            inNetworks: {
                network: string;
                neighbors: any;
            }[];
            name: string;
        }[];
        networks: ({
            name: string;
            graph: Graph;
        } | {
            name: string;
            graph: Graph;
        } | {
            name: string;
            graph: Graph;
        })[];
    };
}
export declare type IT_FeatureNetwork = {
    name: string;
};
export { DirectedGraph };
declare const _default: {};
export default _default;
