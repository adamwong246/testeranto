"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTree = exports.buildTree = void 0;
const buildTree = (features) => {
    const tree = {};
    features.forEach(({ name, status }) => {
        const parts = name.split(" - ");
        const projectAndTest = parts.slice(0, 2).join(" - ");
        const givenAndThen = parts.slice(2).join(" - ");
        const pathParts = projectAndTest.split("/");
        let current = tree;
        pathParts.forEach((part) => {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        });
        current[givenAndThen] = status;
    });
    return tree;
};
exports.buildTree = buildTree;
const renderTree = (nodes) => (React.createElement("ul", null, Object.entries(nodes).map(([key, value]) => (React.createElement("li", { key: key }, typeof value === "string" ? (React.createElement("span", null,
    key,
    " - ",
    value)) : (React.createElement(React.Fragment, null,
    React.createElement("span", null, key),
    (0, exports.renderTree)(value))))))));
exports.renderTree = renderTree;
