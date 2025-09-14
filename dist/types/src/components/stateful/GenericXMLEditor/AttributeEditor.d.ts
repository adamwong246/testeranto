import React from 'react';
import { XMLNode } from '../GenericXMLEditorPage';
interface AttributeEditorProps {
    selectedNode: XMLNode | null;
    onUpdateNode: (nodeId: string, attributes: Record<string, string>) => void;
}
export declare const AttributeEditor: React.FC<AttributeEditorProps>;
export {};
