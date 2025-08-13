export interface Feature {
    name: string;
    status: string;
}
export declare const buildTree: (features: Feature[]) => any;
export declare const renderTree: (nodes: any) => JSX.Element;
