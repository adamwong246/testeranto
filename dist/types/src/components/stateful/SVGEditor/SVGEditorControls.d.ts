import React from 'react';
import { SVGNode } from '../SVGEditorPage';
interface SVGEditorControlsProps {
    selectedNode: SVGNode;
    onAddNode: (nodeType: string) => void;
    onRemoveNode: () => void;
}
export declare const SVGEditorControls: React.FC<SVGEditorControlsProps>;
export {};
