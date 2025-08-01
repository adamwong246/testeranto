"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStatusBadge = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const TestStatusBadge = (props) => {
    // Enhanced logging
    console.groupCollapsed(`[TestStatusBadge] Rendering for ${props.testName}`);
    console.log('Raw props:', JSON.parse(JSON.stringify(props)));
    // Simplified status determination
    const hasTests = props.testsExist !== false;
    const testCompleted = props.runTimeErrors !== -1;
    const hasRuntimeErrors = props.runTimeErrors > 0;
    console.log('Status flags:', {
        hasTests,
        testCompleted,
        hasRuntimeErrors,
        typeErrors: props.typeErrors,
        staticErrors: props.staticErrors
    });
    let bddStatus;
    if (!hasTests) {
        console.warn('No tests.json found - marking as failed');
        bddStatus = { text: '❌ No Tests', variant: 'danger' };
    }
    else if (!testCompleted) {
        console.warn('Test did not complete (runTimeErrors=-1) - marking as failed');
        bddStatus = { text: '❌ No Tests', variant: 'danger' };
    }
    else if (hasRuntimeErrors) {
        console.warn(`Test failed with ${props.runTimeErrors} runtime errors`);
        bddStatus = { text: `❌ BDD (${props.runTimeErrors})`, variant: 'danger' };
    }
    else {
        console.log('Test passed all runtime checks');
        bddStatus = { text: '✅ BDD', variant: 'success' };
    }
    if (props.variant === 'compact') {
        console.log('Rendering compact badge:', bddStatus);
        console.groupEnd();
        return react_1.default.createElement(react_bootstrap_1.Badge, { bg: bddStatus.variant }, bddStatus.text);
    }
    console.log('Rendering full badge set with:', {
        bddStatus,
        typeErrors: props.typeErrors,
        staticErrors: props.staticErrors
    });
    console.groupEnd();
    return (react_1.default.createElement("div", { className: "d-flex gap-2" },
        react_1.default.createElement(react_bootstrap_1.Badge, { bg: bddStatus.variant }, bddStatus.text)));
};
exports.TestStatusBadge = TestStatusBadge;
