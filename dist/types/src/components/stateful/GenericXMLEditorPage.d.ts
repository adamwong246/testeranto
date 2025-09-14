import React from "react";
export interface XMLNode {
    id: string;
    type: string;
    attributes: Record<string, string>;
    children: XMLNode[];
    textContent?: string;
}
interface GenericXMLEditorPageProps {
    initialTree: XMLNode;
    renderPreview: (node: XMLNode, isSelected: boolean, eventHandlers: any) => React.ReactElement;
    attributeEditor: (node: XMLNode, onUpdateAttributes: (attrs: Record<string, string>) => void, onUpdateTextContent: (text: string) => void) => React.ReactElement;
    nodeTypes: {
        label: string;
        type: string;
    }[];
    onAddNode: (parentId: string, nodeType: string) => XMLNode;
    additionalControls?: React.ReactNode;
}
export declare const GenericXMLEditorPage: React.FC<GenericXMLEditorPageProps>;
export {};
