import React from 'react';
import { XMLNode } from '../GenericXMLEditorPage';
interface GenericPreviewProps {
    xmlTree: XMLNode;
    selectedNodeId: string | null;
    hiddenNodes: Set<string>;
    renderPreview: (node: XMLNode, isSelected: boolean, eventHandlers: any) => React.ReactElement;
}
export declare const GenericPreview: React.FC<GenericPreviewProps>;
export {};
