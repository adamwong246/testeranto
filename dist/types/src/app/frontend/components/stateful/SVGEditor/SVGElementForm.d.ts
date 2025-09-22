import React from 'react';
export type SVGElementType = 'circle' | 'rect' | 'g';
interface SVGElementFormProps {
    elementType: SVGElementType;
    attributes: any;
    onChange: (attributes: any) => void;
}
export declare const SVGElementForm: React.FC<SVGElementFormProps>;
export {};
