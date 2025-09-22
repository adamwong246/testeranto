import React from 'react';
import { SVGNode } from '../SVGEditorPage';
interface SVGAttributesEditorProps {
    node: SVGNode;
    onUpdateAttributes: (attributes: Record<string, string>) => void;
    onUpdateTextContent?: (text: string) => void;
}
export declare const SVGAttributesEditor: React.FC<SVGAttributesEditorProps>;
export {};
