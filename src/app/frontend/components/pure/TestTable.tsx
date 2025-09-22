import React from "react";
import { Table, Badge } from "react-bootstrap";
import { TestStatusBadge } from "../TestStatusBadge";

interface TestStatus {
  testName: string;
  testsExist: boolean;
  runTimeErrors: number;
  typeErrors: number;
  staticErrors: number;
  runTime: string;
  runTimeTests: number;
}

interface TestTableProps {
  testStatuses: TestStatus[];
  projectName: string;
}

export const TestTable: React.FC<TestTableProps> = ({
  testStatuses,
  projectName,
}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Test</th>
          <th>Runtime</th>
          <th>Status</th>
          <th>Total Tests</th>
          <th>Type Errors</th>
          <th>Lint Errors</th>
        </tr>
      </thead>
      <tbody>
        {testStatuses.map((test) => (
          <tr key={test.testName} data-testid={`test-row-${test.testName}`}>
            <td>
              <a
                href={`#/projects/${projectName}/tests/${encodeURIComponent(
                  test.testName
                )}/${test.runTime}`}
              >
                {test.testName}
              </a>
            </td>
            <td>
              <Badge bg="secondary" className="ms-2">
                {test.runTime}
              </Badge>
            </td>
            <td>
              <TestStatusBadge
                testName={test.testName}
                testsExist={test.testsExist}
                runTimeErrors={test.runTimeErrors}
                typeErrors={test.typeErrors}
                staticErrors={test.staticErrors}
              />
            </td>
            <td>
              {test.runTimeTests >= 0 ? test.runTimeTests : "N/A"}
            </td>
            <td>
              <a
                href={`#/projects/${projectName}/tests/${encodeURIComponent(
                  test.testName
                )}/${test.runTime}#types`}
              >
                {test.typeErrors > 0 ? `❌ ${test.typeErrors}` : "✅"}
              </a>
            </td>
            <td>
              <a
                href={`#/projects/${projectName}/tests/${encodeURIComponent(
                  test.testName
                )}/${test.runTime}#lint`}
              >
                {test.staticErrors > 0 ? `❌ ${test.staticErrors}` : "✅"}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
