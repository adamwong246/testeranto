import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

import 'bootstrap/dist/css/bootstrap.min.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const testerantoConfig = require("../testeranto.config");

export function Report() {

  const [data, setData] = useState<{
    configs: object,
    features: {
      features: {
        name: string,
        description: string,
        relations: any,
      }[]
    },
    tests: object[],
    featureTests: object,
    summaries: []
  }>({
    configs: {},
    features: {
      features: []
    },
    tests: [],
    featureTests: {},
    summaries: []
  });

  const getData = async () => {

    const configs = await (await fetch('testeranto.config.json')).json();
    const features = await (await fetch('TesterantoFeatures.json')).json();
    const featureTests = await (await fetch('results/featureTestJoin.json')).json();
    const summaries = await (await fetch('report.json')).json();
    const testPromises = await configs.tests.map(async (test) => {
      return await (await (await fetch(`results/${test[0]}.json`)).json())
    })
    const tests = await Promise.all(testPromises);

    setData({ configs, features, tests, featureTests, summaries });
  }

  useEffect(() => { getData() }, []);

  return (<div>
    {
      data && data.configs && <>
        <Tabs defaultActiveKey="home">
          <Tab eventKey="home" title="Home">
            <p>
              Welcome to testeranto!
            </p>
            <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
          </Tab>
          <Tab eventKey="features" title="Features">
            <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {data.features.features.map((feature, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`feature-${ndx}`}>
                        {feature.name}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    {data.features.features.map((feature, ndx) => <Tab.Pane eventKey={`feature-${ndx}`} key={ndx}>
                      <p>{feature.name}</p>


                      <Tab.Container id="left-tabs-example5" defaultActiveKey="relations-0">
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {feature.inNetworks.map((summary, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`relations-${ndx2}`}>
                                  {summary.network}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              {feature.inNetworks.map((summary, ndx2) => <Tab.Pane eventKey={`relations-${ndx2}`} key={ndx2}>
                                <pre>{
                                  JSON.stringify(summary.neighbors, null, 2)
                                }</pre>
                              </Tab.Pane>)}
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>



                    </Tab.Pane>)}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Tab>
          <Tab eventKey="results" title="Results">
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {data.tests.map((suite, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`suite-${ndx}`}>
                        {suite.name}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>

                    {/* ////////////////////////// */}

                    {data.tests.map((suite, ndx) => <Tab.Pane eventKey={`suite-${ndx}`} key={ndx}>
                      {/* <pre> <code>{JSON.stringify(suite, null, 2)} </code></pre> */}

                      <Tab.Container id="left-tabs-example2" defaultActiveKey={`given-0`}>
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {suite.givens.map((g, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`given-${ndx2}`}>
                                  {g.name}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              {suite.givens.map((g, ndx2) => <Tab.Pane key={ndx2} eventKey={`given-${ndx2}`} >
                                <p>when</p>
                                <ul>
                                  {g.whens.map((w, ndx3) => <li key={ndx3}>
                                    <p>{w.name}</p>
                                  </li>)}
                                </ul>
                                <p>then</p>
                                <ul>
                                  {g.thens.map((t, ndx3) => <li key={ndx3}>
                                    <p>{t.name}</p>
                                  </li>)}
                                </ul>

                                <pre><code>{JSON.stringify(g.errors, null, 2)}</code></pre>
                                <p>features</p>
                                <ul>
                                  {/* {g.features.map((f, ndx3) => <li key={ndx3}>{f.name}</li>)} */}
                                </ul>
                              </Tab.Pane>)}

                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>

                    </Tab.Pane>)}

                    {/* ////////////////////////// */}

                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Tab>


          <Tab eventKey="featureTests" title="Feature-Tests">
            <Tab.Container id="left-tabs-example7" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {Object.keys(data.featureTests).map((ftKey, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`featureTests-${ndx}`}>
                        {ftKey}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>

                    {/* ////////////////////////// */}

                    {Object.keys(data.featureTests).map((ftKey, ndx) => <Tab.Pane eventKey={`featureTests-${ndx}`} key={ndx}>


                      <Tab.Container id="left-tabs-example8" defaultActiveKey={`ft-suite-0`}>
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {/* <pre> <code>{JSON.stringify(data.featureTests[ftKey], null, 2)} </code></pre> */}
                              {data.featureTests[ftKey].map((s, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`ft-suite-${ndx2}`}>
                                  {s.testKey}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              {data.featureTests[ftKey].map((g, ndx2) => <Tab.Pane key={ndx2} eventKey={`ft-suite-${ndx2}`} >

                                {/* <pre> <code>{JSON.stringify(x)} </code></pre> */}

                                <p>when</p>
                                <ul>
                                  {g.whens.map((w, ndx3) => <li key={ndx3}>
                                    <p>{w}</p>
                                  </li>)}
                                </ul>
                                <p>then</p>
                                <ul>
                                  {g.thens.map((t, ndx3) => <li key={ndx3}>
                                    <p>{t}</p>
                                  </li>)}
                                </ul>

                              </Tab.Pane>)}

                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>

                    </Tab.Pane>)}

                    {/* ////////////////////////// */}

                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Tab>

          <Tab eventKey="summary" title="Summaries">
            <Tab.Container id="left-tabs-example3" defaultActiveKey={`summary-0`}>
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {data.summaries.map((summary, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`summary-${ndx}`}>
                        {summary.name}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    {data.summaries.map((summary, ndx2) => <Tab.Pane key={ndx2} eventKey={`summary-${ndx2}`} >
                      <pre><code>{JSON.stringify(summary, null, 2)}</code></pre>

                      {/* <Tab.Container id="left-tabs-example4" defaultActiveKey={`summarySteps-0`}>
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">

                              {Object.values(summary.report).map((summaryStep, ndx3) => <Nav.Item key={ndx3}>
                                <Nav.Link eventKey={`summarySteps-${ndx3}`}>
                                  <p>{summaryStep.suite.name}</p>
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>

                              {Object.values(summary.report).map((summaryStep, ndx3) => <Tab.Pane key={ndx3} eventKey={`summarySteps-${ndx3}`} >
                                <pre>{JSON.stringify(summaryStep)}</pre>
                              </Tab.Pane>)}
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container> */}


                    </Tab.Pane>)}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Tab>
        </Tabs>
      </>
    }
    {
      !data && <p>LOADING</p>
    }

  </div>)
}

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(Report));
  }
});
