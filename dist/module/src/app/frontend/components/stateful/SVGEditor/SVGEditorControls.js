import React from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
export const SVGEditorControls = ({ selectedNode, onAddNode, onRemoveNode }) => {
    return (React.createElement(Card, null,
        React.createElement(Card.Header, null, "Controls"),
        React.createElement(Card.Body, null,
            React.createElement(ButtonGroup, { vertical: true, className: "w-100" },
                React.createElement("h6", null, "Add Elements:"),
                React.createElement(Button, { variant: "outline-primary", onClick: () => onAddNode('rect') }, "Rectangle"),
                React.createElement(Button, { variant: "outline-primary", onClick: () => onAddNode('circle') }, "Circle"),
                React.createElement(Button, { variant: "outline-primary", onClick: () => onAddNode('path') }, "Path"),
                React.createElement(Button, { variant: "outline-primary", onClick: () => onAddNode('text') }, "Text"),
                React.createElement(Button, { variant: "outline-primary", onClick: () => onAddNode('g') }, "Group"),
                React.createElement("hr", null),
                React.createElement(Button, { variant: "outline-danger", onClick: onRemoveNode }, "Remove This Element")))));
};
