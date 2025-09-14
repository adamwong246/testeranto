import React from 'react';
import { SVGGAttributes } from './SVGTypes';
interface GroupFormProps {
    attributes: SVGGAttributes;
    onChange: (attributes: SVGGAttributes) => void;
}
export declare const GroupForm: React.FC<GroupFormProps>;
export {};
