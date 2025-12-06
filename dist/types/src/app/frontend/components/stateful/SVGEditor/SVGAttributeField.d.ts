import React from 'react';
interface SVGAttributeFieldProps {
    label: string;
    value: any;
    onChange: (value: any) => void;
    type?: 'text' | 'number' | 'color';
}
export declare const SVGAttributeField: React.FC<SVGAttributeFieldProps>;
export {};
