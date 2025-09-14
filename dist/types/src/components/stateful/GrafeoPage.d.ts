export interface GraphMLNode {
    id: string;
    type: string;
    attributes: Record<string, string>;
    children: GraphMLNode[];
    textContent?: string;
}
export declare const GrafeoPage: () => JSX.Element;
