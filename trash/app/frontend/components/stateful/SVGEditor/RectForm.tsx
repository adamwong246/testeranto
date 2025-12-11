import React from 'react';
import { SVGRectAttributes } from './SVGTypes';
import { SVGAttributeField } from './SVGAttributeField';

interface RectFormProps {
  attributes: SVGRectAttributes;
  onChange: (attributes: SVGRectAttributes) => void;
}

export const RectForm: React.FC<RectFormProps> = ({ attributes, onChange }) => {
  const handleChange = (key: keyof SVGRectAttributes, value: any) => {
    onChange({ ...attributes, [key]: value });
  };

  return (
    <div>
      <h3>Rectangle Attributes</h3>
      <SVGAttributeField
        label="X Position"
        value={attributes.x}
        onChange={(value) => handleChange('x', value)}
        type="number"
      />
      <SVGAttributeField
        label="Y Position"
        value={attributes.y}
        onChange={(value) => handleChange('y', value)}
        type="number"
      />
      <SVGAttributeField
        label="Width"
        value={attributes.width}
        onChange={(value) => handleChange('width', value)}
        type="number"
      />
      <SVGAttributeField
        label="Height"
        value={attributes.height}
        onChange={(value) => handleChange('height', value)}
        type="number"
      />
      <SVGAttributeField
        label="RX (Corner Radius X)"
        value={attributes.rx}
        onChange={(value) => handleChange('rx', value)}
        type="number"
      />
      <SVGAttributeField
        label="RY (Corner Radius Y)"
        value={attributes.ry}
        onChange={(value) => handleChange('ry', value)}
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
    </div>
  );
};
