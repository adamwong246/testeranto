"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStatusBadge = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const TestStatusBadge = (props) => {
    // Simplified status determination
    const hasTests = props.testsExist !== false;
    const testCompleted = props.runTimeErrors !== -1;
    const hasRuntimeErrors = props.runTimeErrors > 0;
    let bddStatus;
    if (!hasTests) {
        bddStatus = { text: '❌ No Tests', variant: 'danger' };
    }
    else if (!testCompleted) {
        bddStatus = { text: '❌ No Tests', variant: 'danger' };
    }
    else if (hasRuntimeErrors) {
        bddStatus = { text: `❌ BDD (${props.runTimeErrors})`, variant: 'danger' };
    }
    else {
        bddStatus = { text: '✅ BDD', variant: 'success' };
    }
    if (props.variant === 'compact') {
        console.groupEnd();
        return react_1.default.createElement(react_bootstrap_1.Badge, { bg: bddStatus.variant }, bddStatus.text);
    }
    return (react_1.default.createElement("div", { className: "d-flex gap-2" },
        react_1.default.createElement(react_bootstrap_1.Badge, { bg: bddStatus.variant }, bddStatus.text)));
};
exports.TestStatusBadge = TestStatusBadge;
