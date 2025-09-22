import React from 'react';
import { SVGNode } from '../SVGEditorPage';
interface SVGTreeProps {
    node: SVGNode;
    selectedNodeId: string | null;
    onSelectNode: (id: string) => void;
    onAddNode: (parentId: string, nodeType: string) => void;
    onRemoveNode: (nodeId: string) => void;
    onToggleVisibility: (nodeId: string) => void;
    onMoveNode: (nodeId: string, newParentId: string | null, index: number) => void;
    hiddenNodes: Set<string>;
    dragInfo: {
        isDragging: boolean;
        nodeId: string | null;
    };
    onDragStart: (nodeId: string) => void;
    onDragEnd: () => void;
}
export declare const SVGTree: React.FC<SVGTreeProps>;
export {};
