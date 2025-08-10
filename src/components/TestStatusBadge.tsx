/* eslint-disable @typescript-eslint/no-explicit-any */
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
  // Simplified status determination
  const hasTests = props.testsExist !== false;
  const testCompleted = props.runTimeErrors !== -1;
  const hasRuntimeErrors = props.runTimeErrors > 0;

  let bddStatus;
  if (!hasTests) {
    bddStatus = { text: '❌ No Tests', variant: 'danger' };
  } else if (!testCompleted) {
    bddStatus = { text: '❌ No Tests', variant: 'danger' };
  } else if (hasRuntimeErrors) {
    bddStatus = { text: `❌ BDD (${props.runTimeErrors})`, variant: 'danger' };
  } else {
    bddStatus = { text: '✅ BDD', variant: 'success' };
  }

  if (props.variant === 'compact') {

    console.groupEnd();
    return <Badge bg={bddStatus.variant}>{bddStatus.text}</Badge>;
  }


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
