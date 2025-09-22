/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Container, Alert, Badge, Nav, Col, Row } from "react-bootstrap";

import { TestTable } from "./TestTable";
import { BuildLogViewer } from "./BuildLogViewer";
import { NavBar } from "./NavBar";

import "./../../app.scss";

export type IProjectPageViewProps = {
  summary: any;
  nodeLogs: any;
  webLogs: any;
  pureLogs: any;
  config: any;
  loading: boolean;
  error: string | null;
  projectName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const ProjectPageView = ({
  summary,
  nodeLogs,
  webLogs,
  pureLogs,
  config,
  loading,
  error,
  projectName,
  activeTab,
  setActiveTab,
}: IProjectPageViewProps) => {
  if (loading) return <div>Loading project data...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!summary)
    return <Alert variant="warning">No data found for project</Alert>;

  const testStatuses = Object.entries(summary).map(
    ([testName, testData]: [
      string,
      {
        testsExist?: boolean;
        runTimeErrors: number;
        typeErrors: number;
        staticErrors: number;
        runTimeTests: number;
      }
    ]) => {
      const runTime =
        config.tests?.find((t: [string, string]) => t[0] === testName)?.[1] ||
        "node";
      return {
        testName,
        testsExist: testData.testsExist !== false,
        runTimeErrors: Number(testData.runTimeErrors) || 0,
        typeErrors: Number(testData.typeErrors) || 0,
        staticErrors: Number(testData.staticErrors) || 0,
        runTimeTests: Number(testData.runTimeTests) || 0,
        runTime,
      };
    }
  );

  return (
    <Container fluid>
      <NavBar title={projectName} backLink="/" />

      <Row className="g-0">
        <Col sm={3} className="border-end">
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "tests"}
                onClick={() => setActiveTab("tests")}
                className="d-flex flex-column align-items-start"
              >
                <div className="d-flex justify-content-between w-100">
                  <span>Tests</span>
                  {testStatuses.some((t) => t.runTimeErrors > 0) ? (
                    <Badge bg="danger">❌</Badge>
                  ) : testStatuses.some(
                    (t) => t.typeErrors > 0 || t.staticErrors > 0
                  ) ? (
                    <Badge bg="warning" text="dark">
                      ⚠️
                    </Badge>
                  ) : (
                    <Badge bg="success">✓</Badge>
                  )}
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "node"}
                onClick={() => setActiveTab("node")}
                className="d-flex justify-content-between align-items-center"
              >
                Node build logs
                {nodeLogs?.errors?.length ? (
                  <Badge bg="danger">❌ {nodeLogs.errors.length}</Badge>
                ) : nodeLogs?.warnings?.length ? (
                  <Badge bg="warning" text="dark">
                    ⚠️
                  </Badge>
                ) : null}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "web"}
                onClick={() => setActiveTab("web")}
                className="d-flex justify-content-between align-items-center"
              >
                Web build logs
                {webLogs?.errors?.length ? (
                  <Badge bg="danger">❌ {webLogs.errors.length}</Badge>
                ) : webLogs?.warnings?.length ? (
                  <Badge bg="warning" text="dark">
                    ⚠️
                  </Badge>
                ) : null}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "pure"}
                onClick={() => setActiveTab("pure")}
                className="d-flex justify-content-between align-items-center"
              >
                Pure build logs
                {pureLogs?.errors?.length ? (
                  <Badge bg="danger">❌ {pureLogs.errors.length}</Badge>
                ) : pureLogs?.warnings?.length ? (
                  <Badge bg="warning" text="dark">
                    ⚠️
                  </Badge>
                ) : null}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <div className="p-3">
            {activeTab === "tests" ? (
              <TestTable
                testStatuses={testStatuses}
                projectName={projectName}
              />
            ) : activeTab === "node" ? (
              <BuildLogViewer logs={nodeLogs} runtime="Node" />
            ) : activeTab === "web" ? (
              <BuildLogViewer logs={webLogs} runtime="Web" />
            ) : activeTab === "pure" ? (
              <BuildLogViewer logs={pureLogs} runtime="Pure" />
            ) : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
