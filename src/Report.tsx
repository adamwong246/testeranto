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

import { TesterantoFeatures } from "./Features.js";
import { IRunTime, ITestTypes } from "./lib/types.js";
import ManualExamples from "./ManualExamples.js";
import ExampleTab from "./ExampleTab.js";

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

  const [state, setState] = useState<{
    tests: ITestTypes[],
    buildDir: string,
    features: TesterantoFeatures
    results: any
  }>({
    tests: [],
    buildDir: "",
    features: new TesterantoFeatures({}, {
      undirected: [],
      directed: [],
      dags: []
    }),
    results: {}
  });

  const [tests, setTests] = useState<
    {
      tests: ITestTypes[],
      buildDir: string,
    }

  >({
    tests: [],
    buildDir: ""
  });

  const [features, setFeatures] = useState<TesterantoFeatures>(
    new TesterantoFeatures({}, {
      undirected: [],
      directed: [],
      dags: []
    })
  );

  const [results, setResults] = useState<Record<string, { exitcode, log, testresults, manifest }>>(
    {}
  );

  const importState = async () => {
    const features = await import('features.test.js');
    const config = await (await fetch("./testeranto.json")).json();
    const results = await Promise.all(config.tests.map((test) => {
      return new Promise(async (res, rej) => {
        const src: string = test[0];
        const runtime: IRunTime = test[1];
        const s: string = [tests.buildDir, runtime as string].concat(src.split(".").slice(0, - 1).join(".")).join("/");
        const exitcode = await (await fetch(config.buildDir + "/" + s + "/exitcode")).text()
        const log = await (await fetch(config.buildDir + "/" + s + "/log.txt")).text()
        const testresults = await (await fetch(config.buildDir + "/" + s + "/tests.json")).json()
        const manifest = await (await fetch(config.buildDir + "/" + s + "/manifest.json")).json()

        res({ src, exitcode, log, testresults, manifest })
      })
    }))

    setState({ tests: config.tests as any, results, features: features as any, buildDir: config.buildDir })
  };

  const importFeatures = async () => {
    const module = await import('features.test.js');
    setFeatures(module.default);
  };

  const importTests = async () => {
    const x = await fetch("./testeranto.json")
    const y = await x.json();
    setTests(y as any);
  };

  useEffect(() => { importState(); }, []);

  useEffect(() => { importFeatures(); }, []);
  useEffect(() => { importTests(); }, []);

  useEffect(() => {
    const collateResults = async () => {
      console.log("collating", tests, features);
      const r = tests.tests.reduce(async (p, test) => {
        const src: string = test[0];
        const runtime: IRunTime = test[1];
        console.log(runtime)
        const s: string = [tests.buildDir, runtime as string].concat(src.split(".").slice(0, - 1).join(".")).join("/");
        const exitcode = await (await fetch(s + "/exitcode")).text()
        const log = await (await fetch(s + "/log.txt")).text()
        const testresults = await (await fetch(s + "/tests.json")).text()

        p[src] = { exitcode, log, testresults }
      }, {});

      setResults(r);

    };
    collateResults();
  }, []);

  return (
    <div>
      <style>
        {`
pre, code, p {
  max-width: 40rem;
  text-wrap: auto;
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

      {features && tests && < Tabs defaultActiveKey="manual" >

        <Tab eventKey="manual" title="manual">
          <article>
            <h1>Testeranto</h1>
            <h2>What is testeranto?</h2>
            <p>
              Testeranto is a novel testing framework for typescript project. Inspired by Behavior Driven Development, testeranto allows you to wrap you typescript with gherkin-like semantics, producing a report in the form of a static website. Testeranto runs it's tests both in node and chromium.
            </p>
          </article>
        </Tab>

        <Tab eventKey="config" title="config">
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </Tab>

        <Tab eventKey="results" title="results">
          <pre>{JSON.stringify(state.results, null, 2)}</pre>
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
                    <pre id="theProps">{JSON.stringify(tests.tests, null, 2)}</pre>
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
                            <pre id="theProps">{JSON.stringify(tests.tests, null, 2)}</pre>
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
                            <pre id="theProps">{JSON.stringify(tests.tests, null, 2)}</pre>
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
                            <pre id="theProps">{JSON.stringify(tests.tests, null, 2)}</pre>
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

        <Tab eventKey="tests" title="tests">
          <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
            <Row>
              <Col sm={4}>
                {/* <Tree tests={features.tests} /> */}
                <Nav variant="pills" className="flex-column">
                  {
                    tests.tests.map((t, ndx) =>
                      <Nav.Item key={ndx}>
                        <Nav.Link eventKey={`test-${ndx}`}>
                          {t[0]} - {t[1]}
                        </Nav.Link>
                      </Nav.Item>
                    )
                  }
                </Nav>
              </Col>
              <Col sm={4}>
                <Tab.Content>

                  {
                    tests.tests.map((t, ndx) =>
                      <Tab.Pane eventKey={`test-${ndx}`}>
                        {/* <pre>{JSON.stringify(t, null, 2)}</pre> */}
                        {/* <pre>{JSON.stringify(state.results, null, 2)}</pre> */}
                        <pre>{JSON.stringify(Object.entries(state.results).filter(([k, v]: [string, { src: string }]) => {
                          console.log(v.src, tests.tests[ndx][0])
                          return v.src === tests.tests[ndx][0]
                        }), null, 2)}</pre>

                        {/* {tests.tests.map((t, ndx) => {
                          return (
                            <Tab.Pane eventKey={`feature-${ndx}`} key={ndx}>
                              <pre>{JSON.stringify(t, null, 2)}</pre>
                            </Tab.Pane>
                          )
                        }
                        )} */}

                      </Tab.Pane>

                    )
                  }




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

        <Tab eventKey="examples" title="examples">
          <ExampleTab />
        </Tab>

      </Tabs >}

      <footer>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto </a></footer>

    </div >
  );
};
