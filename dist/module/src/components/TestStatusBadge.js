/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Badge } from 'react-bootstrap';
export const TestStatusBadge = (props) => {
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
        return React.createElement(Badge, { bg: bddStatus.variant }, bddStatus.text);
    }
    return (React.createElement("div", { className: "d-flex gap-2" },
        React.createElement(Badge, { bg: bddStatus.variant }, bddStatus.text)));
};
