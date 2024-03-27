import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Graph from "graphology";
import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';

import 'bootstrap/dist/css/bootstrap.min.css';

import { ITestTypes } from "./Types";
import { TesterantoFeatures } from "./Features";

type IGraphData = {
  nodes: { id: string, label: string }[],
  edges: { id: string, source: string, target: string, label: string }[]
}

const graphToIGraphData: (g: Graph) => IGraphData = (g) => {
  return {
    nodes: g.nodes().map((n) => {
      return {
        id: n,
        label: n
      }
    }),
    edges: g.mapEdges((id, attributes, source, target) => {
      return {
        id,
        label: id,
        source,
        target,
      }
    })
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(Report, {}));
  }
});

const Report = () => {
  const [tests, setTests] = useState<
    ITestTypes[]
  >([]);
  const [features, setFeatures] = useState<TesterantoFeatures>(
    new TesterantoFeatures({}, {
      undirected: [],
      directed: [],
      dags: []
    })
  );

  useEffect(() => {
    const importTests = async () => {
      const module = await import('tests.test.js');
      setTests(module.default);
    };

    importTests();
  }, []);

  useEffect(() => {
    const importFeatures = async () => {
      const module = await import('features.test.js');
      setFeatures(module.default);
    };

    importFeatures();
  }, []);


  return (
    <div>
      <style>
        {`
pre, code, p {
  max-width: 30rem;
}
footer {
  background-color: lightgray;
  margin: 0.5rem;
  padding: 0.5rem;
  position: fixed;
  bottom: 0;
  right: 0;
}
          `}
      </style>

      {features && tests && < Tabs defaultActiveKey="home" >

        <Tab eventKey="home" title="config">
          <pre>{JSON.stringify(features, null, 2)}</pre>
          <pre>{JSON.stringify(tests, null, 2)}</pre>
        </Tab>

        <Tab eventKey="features" title="features">
          <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
            <Row>
              <Col sm={2}>
                <Nav variant="pills" className="flex-column">
                  {Object.keys(features.features).map((featureKey, ndx) => <Nav.Item key={ndx}>
                    <Nav.Link eventKey={`feature-${ndx}`}>
                      {featureKey}
                    </Nav.Link>
                  </Nav.Item>)}
                </Nav>
              </Col>
              <Col sm={6}>
                <Tab.Content>
                  {Object.keys(features.features).map((featureKey, ndx) => {
                    const feature = features[featureKey];
                    return (
                      <Tab.Pane eventKey={`feature-${ndx}`} key={ndx}>
                        <pre>{JSON.stringify(feature, null, 2)}</pre>
                      </Tab.Pane>
                    )
                  }
                  )}
                </Tab.Content>
              </Col>

              <Col sm={4}>
                < Tabs defaultActiveKey="feature.networks" >
                  <Tab eventKey="feature.networks" title="networks">
                    < Tabs defaultActiveKey="dag" >

                      <Tab eventKey="dag" title="DAG">
                        <Tab.Content>
                          <pre>{JSON.stringify(features.graphs.dags, null, 2)}</pre>
                        </Tab.Content>
                      </Tab>

                      <Tab eventKey="directed" title="Directed">
                        <Tab.Content>
                          <pre>{JSON.stringify(features.graphs.directed, null, 2)}</pre>
                        </Tab.Content>
                      </Tab>

                      <Tab eventKey="undirected" title="Undirected">
                        <Tab.Content>
                          <pre>{JSON.stringify(features.graphs.undirected, null, 2)}</pre>
                        </Tab.Content>
                      </Tab>

                    </Tabs>
                  </Tab>

                  <Tab eventKey="feature.tests" title="tests">
                    <pre id="theProps">{JSON.stringify(tests, null, 2)}</pre>
                  </Tab>
                </Tabs>
              </Col>

            </Row>
          </Tab.Container>
        </Tab>

        <Tab eventKey="networks" title="networks">
          <Tab.Container id="left-tabs-example88" defaultActiveKey={`dag`}>
            <Row>
              < Tabs defaultActiveKey="dag" >

                <Tab eventKey="dag" title="DAG">
                  <Tab.Content>

                    <Row>
                      <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                          {features.graphs.dags.map((g, ndx2) => <Nav.Item key={ndx2}>
                            <Nav.Link eventKey={`networks-dags-${ndx2}`}>
                              {g.name}
                            </Nav.Link>
                          </Nav.Item>
                          )}
                        </Nav>
                      </Col>
                      <Col sm={6}>
                        <Tab.Content>

                          {
                            features.graphs.dags[0] && <>
                              <Sigma graph={graphToIGraphData(features.graphs.dags[0].graph)} settings={{ drawEdges: true, clone: false }}>
                                <RelativeSize initialSize={25} />
                                <RandomizeNodePositions />
                              </Sigma>
                              <pre>{JSON.stringify(features.graphs.dags[0].graph, null, 2)}</pre>
                            </>
                          }



                        </Tab.Content>
                      </Col>

                      <Col sm={4}>
                        < Tabs defaultActiveKey="networks.features" >
                          <Tab eventKey="networks.features" title="features">
                            <pre id="theProps">{JSON.stringify(features, null, 2)}</pre>
                          </Tab>

                          <Tab eventKey="feature.tests" title="tests">
                            <pre id="theProps">{JSON.stringify(tests, null, 2)}</pre>
                          </Tab>
                        </Tabs>
                      </Col>

                    </Row>

                  </Tab.Content>
                </Tab>

                <Tab eventKey="directed" title="Directed">
                  <Tab.Content>

                    <Row>
                      <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                          {features.graphs.directed.map((g, ndx2) => <Nav.Item key={ndx2}>
                            <Nav.Link eventKey={`networks-directed-${ndx2}`}>
                              {g.name}
                            </Nav.Link>
                          </Nav.Item>
                          )}
                        </Nav>
                      </Col>
                      <Col sm={6}>
                        <Tab.Content>

                          {
                            features.graphs.directed[0] && <>
                              <Sigma graph={graphToIGraphData(features.graphs.directed[0].graph)} settings={{ drawEdges: true, clone: false }}>
                                <RelativeSize initialSize={25} />
                                <RandomizeNodePositions />
                              </Sigma>
                              <pre>{JSON.stringify(features.graphs.directed[0].graph, null, 2)}</pre>
                            </>
                          }




                        </Tab.Content>
                      </Col>
                      <Col sm={4}>
                        < Tabs defaultActiveKey="networks.features" >
                          <Tab eventKey="networks.features" title="features">
                            <pre id="theProps">{JSON.stringify(features, null, 2)}</pre>
                          </Tab>

                          <Tab eventKey="feature.tests" title="tests">
                            <pre id="theProps">{JSON.stringify(tests, null, 2)}</pre>
                          </Tab>
                        </Tabs>
                      </Col>
                    </Row>

                  </Tab.Content>
                </Tab>

                <Tab eventKey="undirected" title="Undirected">
                  <Tab.Content>
                    <Row>
                      <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                          {features.graphs.undirected.map((g, ndx2) => <Nav.Item key={ndx2}>
                            <Nav.Link eventKey={`networks-undirected-${ndx2}`}>
                              {g.name}
                            </Nav.Link>
                          </Nav.Item>
                          )}
                        </Nav>
                      </Col>
                      <Col sm={6}>
                        <Tab.Content>

                          {
                            features.graphs.undirected[0] && <>
                              <Sigma graph={graphToIGraphData(features.graphs.undirected[0].graph)} settings={{ drawEdges: true, clone: false }}>
                                <RelativeSize initialSize={25} />
                                <RandomizeNodePositions />
                              </Sigma>
                              <pre>{JSON.stringify(features.graphs.undirected[0].graph, null, 2)}</pre>
                            </>
                          }




                        </Tab.Content>
                      </Col>
                      <Col sm={4}>
                        < Tabs defaultActiveKey="networks.features" >
                          <Tab eventKey="networks.features" title="features">
                            <pre id="theProps">{JSON.stringify(features, null, 2)}</pre>
                          </Tab>

                          <Tab eventKey="feature.tests" title="tests">
                            <pre id="theProps">{JSON.stringify(tests, null, 2)}</pre>
                          </Tab>
                        </Tabs>
                      </Col>
                    </Row>
                  </Tab.Content>
                </Tab>

              </Tabs>


            </Row>
          </Tab.Container>
        </Tab>

        <Tab eventKey="results" title="tests">
          <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
            <Row>
              <Col sm={2}>
                {/* <Tree tests={features.tests} /> */}
                {/* <Nav variant="pills" className="flex-column">
                    {
                      features.tests.map((t, ndx) =>
                        <Nav.Item key={ndx}>
                          <Nav.Link eventKey={`test-${ndx}`}>
                            {t[0]} - {t[1]}
                          </Nav.Link>
                        </Nav.Item>
                      )
                    }
                  </Nav> */}
              </Col>
              <Col sm={6}>
                <Tab.Content>
                  {tests.map((t, ndx) => {
                    return (
                      <Tab.Pane eventKey={`feature-${ndx}`} key={ndx}>
                        <pre>{JSON.stringify(t, null, 2)}</pre>
                      </Tab.Pane>
                    )
                  }
                  )}
                </Tab.Content>
              </Col>

              <Col sm={4}>
                < Tabs defaultActiveKey="feature.networks" >
                  <Tab eventKey="feature.networks" title="networks">
                    < Tabs defaultActiveKey="dag" >

                      <Tab eventKey="dag" title="DAG">
                        <Tab.Content>
                          <pre>{JSON.stringify(features.graphs.dags, null, 2)}</pre>
                        </Tab.Content>
                      </Tab>

                      <Tab eventKey="directed" title="Directed">
                        <Tab.Content>
                          <pre>{JSON.stringify(features.graphs.directed, null, 2)}</pre>
                        </Tab.Content>
                      </Tab>

                      <Tab eventKey="undirected" title="Undirected">
                        <Tab.Content>
                          <pre>{JSON.stringify(features.graphs.undirected, null, 2)}</pre>
                        </Tab.Content>
                      </Tab>

                    </Tabs>
                  </Tab>

                  <Tab eventKey="tests.features" title="features">
                    <pre id="theProps">{JSON.stringify(features, null, 2)}</pre>
                  </Tab>
                </Tabs>
              </Col>

            </Row>
          </Tab.Container>
        </Tab>

      </Tabs >}

      <footer>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto </a></footer>

    </div >
  );
};
