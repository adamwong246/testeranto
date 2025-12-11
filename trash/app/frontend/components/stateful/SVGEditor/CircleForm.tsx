import React from 'react';
import { SVGCircleAttributes } from './SVGTypes';
import { SVGAttributeField } from './SVGAttributeField';

interface CircleFormProps {
  attributes: SVGCircleAttributes;
  onChange: (attributes: SVGCircleAttributes) => void;
}

export const CircleForm: React.FC<CircleFormProps> = ({ attributes, onChange }) => {
  const handleChange = (key: keyof SVGCircleAttributes, value: any) => {
    onChange({ ...attributes, [key]: value });
  };

  return (
    <div>
      <h3>Circle Attributes</h3>
      <SVGAttributeField
        label="Center X"
        value={attributes.cx}
        onChange={(value) => handleChange('cx', value)}
        type="number"
      />
      <SVGAttributeField
        label="Center Y"
        value={attributes.cy}
        onChange={(value) => handleChange('cy', value)}
        type="number"
      />
      <SVGAttributeField
        label="Radius"
        value={attributes.r}
        onChange={(value) => handleChange('r', value)}
        type="number"
      />
      <SVGAttributeField
        label="Fill Color"
        value={attributes.fill}
        onChange={(value) => handleChange('fill', value)}
        type="color"
      />
      <SVGAttributeField
        label="Stroke Color"
        value={attributes.stroke}
        onChange={(value) => handleChange('stroke', value)}
        type="color"
      />
      <SVGAttributeField
        label="Stroke Width"
        value={attributes.strokeWidth}
        onChange={(value) => handleChange('strokeWidth', value)}
        type="number"
      />
      <SVGAttributeField
        label="ID"
        value={attributes.id}
        onChange={(value) => handleChange('id', value)}
        type="text"
      />
      <SVGAttributeField
        label="Class Name"
        value={attributes.className}
        onChange={(value) => handleChange('className', value)}
        type="text"
      />
    </div>
  );
};
