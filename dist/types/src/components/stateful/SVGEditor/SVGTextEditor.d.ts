import React from 'react';
import { SVGNode } from '../SVGEditorPage';
interface SVGTextEditorProps {
    svgTree: SVGNode;
    onUpdateTree: (tree: SVGNode) => void;
}
export declare const SVGTextEditor: React.FC<SVGTextEditorProps>;
export {};
