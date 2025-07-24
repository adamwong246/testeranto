import React from 'react';
import { Badge } from 'react-bootstrap';
export const TestStatusBadge = (props) => {
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
        return React.createElement(Badge, { bg: bddStatus.variant }, bddStatus.text);
    }
    console.log('Rendering full badge set with:', {
        bddStatus,
        typeErrors: props.typeErrors,
        staticErrors: props.staticErrors
    });
    console.groupEnd();
    return (React.createElement("div", { className: "d-flex gap-2" },
        React.createElement(Badge, { bg: bddStatus.variant }, bddStatus.text)));
};
