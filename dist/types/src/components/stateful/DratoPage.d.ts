export interface BootstrapNode {
    id: string;
    type: string;
    attributes: Record<string, string>;
    children: BootstrapNode[];
    textContent?: string;
}
export declare const DratoPage: () => JSX.Element;
