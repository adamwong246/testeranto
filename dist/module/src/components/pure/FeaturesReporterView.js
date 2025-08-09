import React from 'react';
export const FeaturesReporterView = ({ treeData }) => {
    return (React.createElement("div", { className: "features-reporter" },
        React.createElement("h1", null, "File Structure"),
        React.createElement("div", { className: "tree-container" }, treeData.map(project => {
            var _a;
            return (React.createElement("div", { key: project.name, className: "project" },
                React.createElement("h3", null, project.name),
                React.createElement("ul", { className: "file-tree" }, (_a = project.children) === null || _a === void 0 ? void 0 : _a.map(file => renderFile(file)))));
        }))));
};
function renderFile(node) {
    return (React.createElement("li", { key: node.name },
        React.createElement("span", null, node.name),
        node.children && (React.createElement("ul", null, node.children.map(child => renderFile(child))))));
}
