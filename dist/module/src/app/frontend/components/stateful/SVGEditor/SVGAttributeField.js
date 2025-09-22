import React from 'react';
export const SVGAttributeField = ({ label, value, onChange, type = 'text' }) => {
    return (React.createElement("div", { style: { marginBottom: '8px' } },
        React.createElement("label", { style: { display: 'block', marginBottom: '4px' } },
            label,
            ":"),
        React.createElement("input", { type: type, value: value || '', onChange: (e) => onChange(e.target.value), style: { width: '100%' } })));
};
