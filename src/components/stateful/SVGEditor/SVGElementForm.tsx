import React from 'react';
import { CircleForm } from './CircleForm';
import { RectForm } from './RectForm';
import { GroupForm } from './GroupForm';
import { SVGCircleAttributes, SVGRectAttributes, SVGGAttributes } from './SVGTypes';

export type SVGElementType = 'circle' | 'rect' | 'g';

interface SVGElementFormProps {
  elementType: SVGElementType;
  attributes: any;
  onChange: (attributes: any) => void;
}

export const SVGElementForm: React.FC<SVGElementFormProps> = ({
  elementType,
  attributes,
  onChange
}) => {
  switch (elementType) {
    case 'circle':
      return (
        <CircleForm
          attributes={attributes as SVGCircleAttributes}
          onChange={onChange}
        />
      );
    case 'rect':
      return (
        <RectForm
          attributes={attributes as SVGRectAttributes}
          onChange={onChange}
        />
      );
    case 'g':
      return (
        <GroupForm
          attributes={attributes as SVGGAttributes}
          onChange={onChange}
        />
      );
    default:
      return <div>Select an element type</div>;
  }
};
