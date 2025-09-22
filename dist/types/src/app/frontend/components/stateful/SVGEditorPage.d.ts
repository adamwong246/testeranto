export interface SVGNode {
    id: string;
    type: string;
    attributes: Record<string, string>;
    children: SVGNode[];
}
export declare const SVGEditorPage: () => JSX.Element;
