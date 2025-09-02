import React from 'react';

interface SVGAttributeFieldProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: 'text' | 'number' | 'color';
}

export const SVGAttributeField: React.FC<SVGAttributeFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text'
}) => {
  return (
    <div style={{ marginBottom: '8px' }}>
      <label style={{ display: 'block', marginBottom: '4px' }}>
        {label}:
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%' }}
      />
    </div>
  );
};
