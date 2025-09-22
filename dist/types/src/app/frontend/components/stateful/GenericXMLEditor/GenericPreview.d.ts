import React from "react";
import { XMLNode } from "../GenericXMLEditorPage";
interface GenericPreviewProps {
    onTreeUpdate: any;
    xmlTree: XMLNode;
    selectedNodeId: string | null;
    hiddenNodes: Set<string>;
    renderPreview: (node: XMLNode, isSelected: boolean, eventHandlers: any, onTreeUpdate?: (newTree: XMLNode) => void) => React.ReactElement;
}
export declare const GenericPreview: React.FC<GenericPreviewProps>;
export {};
