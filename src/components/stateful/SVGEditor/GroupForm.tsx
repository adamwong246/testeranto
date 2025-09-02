import React from 'react';
import { SVGGAttributes } from './SVGTypes';
import { SVGAttributeField } from './SVGAttributeField';

interface GroupFormProps {
  attributes: SVGGAttributes;
  onChange: (attributes: SVGGAttributes) => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({ attributes, onChange }) => {
  const handleChange = (key: keyof SVGGAttributes, value: any) => {
    onChange({ ...attributes, [key]: value });
  };

  return (
    <div>
      <h3>Group Attributes</h3>
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
      <SVGAttributeField
        label="Transform"
        value={attributes.transform}
        onChange={(value) => handleChange('transform', value)}
        type="text"
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
    </div>
  );
};
