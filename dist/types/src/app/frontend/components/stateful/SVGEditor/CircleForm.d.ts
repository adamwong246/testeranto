import React from 'react';
import { SVGCircleAttributes } from './SVGTypes';
interface CircleFormProps {
    attributes: SVGCircleAttributes;
    onChange: (attributes: SVGCircleAttributes) => void;
}
export declare const CircleForm: React.FC<CircleFormProps>;
export {};
