import React from 'react';
import { SVGRectAttributes } from './SVGTypes';
interface RectFormProps {
    attributes: SVGRectAttributes;
    onChange: (attributes: SVGRectAttributes) => void;
}
export declare const RectForm: React.FC<RectFormProps>;
export {};
