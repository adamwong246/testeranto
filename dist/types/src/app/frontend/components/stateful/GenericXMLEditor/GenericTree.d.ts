import React from 'react';
import { XMLNode } from '../GenericXMLEditorPage';
interface GenericTreeProps {
    node: XMLNode;
    selectedNodeId: string | null;
    onSelectNode: (id: string) => void;
    onAddNode: (parentId: string, nodeType: string) => void;
    onRemoveNode: (nodeId: string) => void;
    onToggleVisibility: (nodeId: string) => void;
    hiddenNodes: Set<string>;
    nodeTypes: {
        label: string;
        type: string;
    }[];
}
export declare const GenericTree: React.FC<GenericTreeProps>;
export {};
