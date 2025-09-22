"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesReporterView = void 0;
const react_1 = __importDefault(require("react"));
const FeaturesReporterView = ({ treeData }) => {
    return (react_1.default.createElement("div", { className: "features-reporter" },
        react_1.default.createElement("h1", null, "File Structure"),
        react_1.default.createElement("div", { className: "tree-container" }, treeData.map(project => {
            var _a;
            return (react_1.default.createElement("div", { key: project.name, className: "project" },
                react_1.default.createElement("h3", null, project.name),
                react_1.default.createElement("ul", { className: "file-tree" }, (_a = project.children) === null || _a === void 0 ? void 0 : _a.map(file => renderFile(file)))));
        }))));
};
exports.FeaturesReporterView = FeaturesReporterView;
function renderFile(node) {
    return (react_1.default.createElement("li", { key: node.name },
        react_1.default.createElement("span", null, node.name),
        node.children && (react_1.default.createElement("ul", null, node.children.map(child => renderFile(child))))));
}
