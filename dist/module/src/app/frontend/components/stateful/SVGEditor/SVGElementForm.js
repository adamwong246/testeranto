import React from 'react';
import { CircleForm } from './CircleForm';
import { RectForm } from './RectForm';
import { GroupForm } from './GroupForm';
export const SVGElementForm = ({ elementType, attributes, onChange }) => {
    switch (elementType) {
        case 'circle':
            return (React.createElement(CircleForm, { attributes: attributes, onChange: onChange }));
        case 'rect':
            return (React.createElement(RectForm, { attributes: attributes, onChange: onChange }));
        case 'g':
            return (React.createElement(GroupForm, { attributes: attributes, onChange: onChange }));
        default:
            return React.createElement("div", null, "Select an element type");
    }
};
