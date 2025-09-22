import React from 'react';
import { SVGNode } from '../SVGEditorPage';
interface SVGPreviewProps {
    svgTree: SVGNode;
    editMode: string;
    showGrid: boolean;
    selectedNodeId: string | null;
    onNodeInteraction: (nodeId: string, updates: Record<string, string>) => void;
    hiddenNodes: Set<string>;
}
export declare const SVGPreview: React.FC<SVGPreviewProps>;
export {};
