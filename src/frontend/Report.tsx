import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Spinner,
  ListGroup,
  ProgressBar,
  Accordion,
  Table
} from "react-bootstrap";
import "./../style.scss"

export interface ReportProps {
  testName: string;
  runtime: string;
  sourceFilePath: string;
  testSuite: string;
}

interface TestData {
  name: string;
  givens: Array<{
    key: string;
    whens: Array<{
      name: string;
      status: boolean;
      error: string | null;
      artifacts: any[];
    }>;
    thens: Array<{
      name: string;
      error: boolean;
      artifacts: any[];
      status: boolean;
    }>;
    error: string | null;
    failed: boolean;
    features: string[];
    artifacts: any[];
    status: boolean;
  }>;
  fails: number;
  failed: boolean;
  features: string[];
  artifacts: any[];
}

export const Report: React.FC<ReportProps> = ({
  testName,
  runtime,
  sourceFilePath,
  testSuite
}) => {
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const jsonPath = 'tests.json';
    fetch(jsonPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: TestData) => {
        setTestData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load tests.json:', err);
        setError(`Failed to load test data: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const renderTestData = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading test data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" className="my-4">
          <Alert.Heading>Error Loading Test Data</Alert.Heading>
          <p>{error}</p>
        </Alert>
      );
    }

    if (!testData) {
      return (
        <Alert variant="warning" className="my-4">
          No test data available.
        </Alert>
      );
    }

    const totalGivens = testData.givens.length;
    const passedGivens = testData.givens.filter(g => g.status).length;
    const passPercentage = totalGivens > 0 ? Math.round((passedGivens / totalGivens) * 100) : 0;

    return (
      <Container fluid className="px-0">
        {/* Summary Card */}
        <Card className="mb-4">
          <Card.Header as="h5" className="bg-light">
            <Row className="align-items-center">
              <Col>
                Test Suite: <strong>{testData.name}</strong>
              </Col>
              <Col className="text-end">
                <Badge bg={testData.failed ? "danger" : "success"} className="fs-6">
                  {testData.failed ? "FAILED" : "PASSED"}
                </Badge>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3} className="mb-3">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Card.Title as="h2">{totalGivens}</Card.Title>
                    <Card.Text className="text-muted">Total Scenarios</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Card.Title as="h2" className="text-success">{passedGivens}</Card.Title>
                    <Card.Text className="text-muted">Passed</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Card.Title as="h2" className="text-danger">{testData.fails}</Card.Title>
                    <Card.Text className="text-muted">Failures</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Card.Title as="h2">{passPercentage}%</Card.Title>
                    <Card.Text className="text-muted">Pass Rate</Card.Text>
                    <ProgressBar
                      now={passPercentage}
                      variant={passPercentage === 100 ? "success" : passPercentage > 70 ? "warning" : "danger"}
                      className="mt-2"
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {testData.features.length > 0 && (
              <div className="mt-3">
                <h6>Features Tested:</h6>
                <div>
                  {testData.features.map((feature, idx) => (
                    <Badge key={idx} bg="info" className="me-2 mb-2">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Test Scenarios */}
        <Card>
          <Card.Header as="h5" className="bg-light">
            Test Scenarios
          </Card.Header>
          <Card.Body className="p-0">
            <Accordion flush>
              {testData.givens.map((given, idx) => (
                <Accordion.Item key={idx} eventKey={idx.toString()}>
                  <Accordion.Header>
                    <div className="d-flex align-items-center w-100">
                      <div className="me-3">
                        {given.status ?
                          <Badge bg="success">PASS</Badge> :
                          <Badge bg="danger">FAIL</Badge>
                        }
                      </div>
                      <div className="flex-grow-1">
                        <strong>{given.key}</strong>
                      </div>
                      <div className="text-muted me-3">
                        {given.whens.length} whens • {given.thens.length} thens
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        <h6>Whens:</h6>
                        <ListGroup variant="flush">
                          {given.whens.map((when, wIdx) => (
                            <ListGroup.Item key={wIdx} className="d-flex justify-content-between align-items-center">
                              <span>{when.name}</span>
                              <Badge bg={when.status ? "success" : "danger"}>
                                {when.status ? "✓" : "✗"}
                              </Badge>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Col>
                      <Col md={6}>
                        <h6>Thens:</h6>
                        <ListGroup variant="flush">
                          {given.thens.map((then, tIdx) => (
                            <ListGroup.Item key={tIdx} className="d-flex justify-content-between align-items-center">
                              <span>{then.name}</span>
                              <Badge bg={then.status ? "success" : "danger"}>
                                {then.status ? "✓" : "✗"}
                              </Badge>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Col>
                    </Row>
                    {given.features && given.features.length > 0 && (
                      <div className="mt-3">
                        <h6>Features:</h6>
                        <div>
                          {given.features.map((feature, fIdx) => (
                            <Badge key={fIdx} bg="secondary" className="me-1">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {given.error && (
                      <Alert variant="danger" className="mt-3">
                        <Alert.Heading>Error</Alert.Heading>
                        <p className="mb-0">{given.error}</p>
                      </Alert>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      </Container>
    );
  };

  return (
    <Container className="py-4">
      <Card className="border-0 shadow">
        <Card.Header className="bg-primary text-white">
          <Row className="align-items-center">
            <Col>
              <h2 className="mb-0">Test Report: {testName}</h2>
            </Col>
            <Col className="text-end">
              <Badge bg="light" text="dark" className="fs-6">
                {runtime.toUpperCase()}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <Table borderless size="sm">
                <tbody>
                  <tr>
                    <td><strong>Test Name:</strong></td>
                    <td>{testName}</td>
                  </tr>
                  <tr>
                    <td><strong>Source File:</strong></td>
                    <td><code>{sourceFilePath}</code></td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table borderless size="sm">
                <tbody>
                  <tr>
                    <td><strong>Runtime:</strong></td>
                    <td>
                      <Badge bg="info">{runtime}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Test Suite:</strong></td>
                    <td>{testSuite}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          <hr />

          {renderTestData()}

          <div className="mt-4 text-center text-muted small">
            <p className="mb-0">
              Report generated by Testeranto • {new Date().toLocaleDateString()}
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Function to render the component to a DOM element
export const renderReport = (elementId: string, props: ReportProps) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }
  const root = ReactDOM.createRoot(element);
  root.render(<Report {...props} />);
};

// Expose to global scope for direct usage
if (typeof window !== 'undefined') {
  (window as any).ReportComponent = Report;
  (window as any).renderReport = renderReport;
}
