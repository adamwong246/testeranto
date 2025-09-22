import React from 'react';
import { XMLNode } from '../GenericXMLEditorPage';
interface AttributeEditorProps {
    node: XMLNode | null;
    onUpdateAttributes: (attrs: Record<string, string>) => void;
    onUpdateTextContent?: (text: string) => void;
}
export declare const AttributeEditor: React.FC<AttributeEditorProps>;
export {};
