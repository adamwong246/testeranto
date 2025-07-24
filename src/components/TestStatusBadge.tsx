import React from 'react';
import { Badge } from 'react-bootstrap';

type TestStatusBadgeProps = {
  testName: string;
  testsExist?: boolean;
  runTimeErrors: number;
  typeErrors: number;
  staticErrors: number;
  variant?: 'compact' | 'full';
  testData?: {
    fails?: number;
    features?: any[];
    artifacts?: any[];
  };
};

export const TestStatusBadge = (props: TestStatusBadgeProps) => {
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
  } else if (!testCompleted) {
    console.warn('Test did not complete (runTimeErrors=-1) - marking as failed');
    bddStatus = { text: '❌ No Tests', variant: 'danger' };
  } else if (hasRuntimeErrors) {
    console.warn(`Test failed with ${props.runTimeErrors} runtime errors`);
    bddStatus = { text: `❌ BDD (${props.runTimeErrors})`, variant: 'danger' };
  } else {
    console.log('Test passed all runtime checks');
    bddStatus = { text: '✅ BDD', variant: 'success' };
  }

  if (props.variant === 'compact') {
    console.log('Rendering compact badge:', bddStatus);
    console.groupEnd();
    return <Badge bg={bddStatus.variant}>{bddStatus.text}</Badge>;
  }

  console.log('Rendering full badge set with:', {
    bddStatus,
    typeErrors: props.typeErrors,
    staticErrors: props.staticErrors
  });
  console.groupEnd();

  return (
    <div className="d-flex gap-2">
      <Badge bg={bddStatus.variant}>{bddStatus.text}</Badge>
      {/* <Badge bg={props.typeErrors > 0 ? 'danger' : 'success'}>
        {props.typeErrors > 0 ? `❌ tsc (${props.typeErrors})` : '✅ tsc'}
      </Badge>
      <Badge bg={props.staticErrors > 0 ? 'danger' : 'success'}>
        {props.staticErrors > 0 ? `❌ eslint (${props.staticErrors})` : '✅ eslint'}
      </Badge> */}
    </div>
  );
};
