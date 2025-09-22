import React from 'react';
import { XMLNode } from '../GenericXMLEditorPage';
interface GenericTextEditorProps {
    xmlTree: XMLNode;
    onUpdateTree: (tree: XMLNode) => void;
}
export declare const GenericTextEditor: React.FC<GenericTextEditorProps>;
export {};
