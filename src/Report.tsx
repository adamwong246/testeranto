import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

import 'bootstrap/dist/css/bootstrap.min.css';

export function Report() {

  const [data, setData] = useState<{
    configs: object,
    features: {
      features: any[]
    },
    tests: any[],
    featureTests: object,
    summaries: { dags: [], directed: [], undirected: [] }
  }>({
    configs: {},
    features: {
      features: []
    },
    tests: [],
    featureTests: {},
    summaries: { dags: [], directed: [], undirected: [] }
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
          <Tab eventKey="home" title="config">
            <pre><code>{JSON.stringify(data.configs, null, 2)}</code></pre>
          </Tab>
          <Tab eventKey="features" title="features">
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
          <Tab eventKey="results" title="tests">
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {data.tests.map((suite, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`suite-${ndx}`}>
                        {(suite.fails.length > 0 ? `❌ * ${suite.fails.length.toString()}` : `✅ * ${suite.givens.length.toString()}`)} - {suite.name}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    {data.tests.map((suite, ndx) => <Tab.Pane eventKey={`suite-${ndx}`} key={ndx}>
                      <Tab.Container id="left-tabs-example2" defaultActiveKey={`given-0`}>
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {suite.givens.map((g, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`given-${ndx2}`}>
                                  {(g.errors ? `❌` : `✅`)} - {g.name}
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
                                    {/* <p>{w.name}</p> */}
                                    {(w.error === true ? `❌` : `✅`)} - {w.name}
                                  </li>)}
                                </ul>
                                <p>then</p>
                                <ul>
                                  {g.thens.map((t, ndx3) => <li key={ndx3}>
                                    <p>
                                      {(t.error === true ? `❌` : `✅`)} - {t.name}
                                    </p>
                                  </li>)}
                                </ul>
                                <pre><code>{JSON.stringify(g.errors, null, 2)}</code></pre>
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
          <Tab eventKey="featureTests" title="feature-tests">
            <Tab.Container id="left-tabs-example7" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {Object.keys(data.featureTests).map((ftKey, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`featureTests-${ndx}`}>
                        {Object.values(data.featureTests[ftKey]).reduce((testMemo, test: any) => test.errors) ? `❌` : `✅`} {ftKey}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    {Object.keys(data.featureTests).map((ftKey, ndx) => <Tab.Pane eventKey={`featureTests-${ndx}`} key={ndx}>
                      <Tab.Container id="left-tabs-example8" defaultActiveKey={`ft-suite-0`}>
                        <Row>
                          <Col sm={6}>
                            <Nav variant="pills" className="flex-column">
                              {data.featureTests[ftKey].map((s, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`ft-suite-${ndx2}`}>
                                  {s.errors ? `❌` : `✅`} <strong>{s.testKey}</strong>  <em>{s.name}</em>
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={6}>
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

                                <pre><code>{JSON.stringify(g.errors, null, 2)}</code></pre>

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

          <Tab eventKey="networks" title="networks">
            <Tab.Container id="left-tabs-example88" defaultActiveKey={`networks-dags`}>
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Link eventKey={`networks-dags`}>
                      DAG
                    </Nav.Link>
                    <Nav.Link eventKey={`networks-directed`}>
                      Directed (not acyclic)
                    </Nav.Link>
                    <Nav.Link eventKey={`networks-undirected`}>
                      Undirected
                    </Nav.Link>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey={`networks-dags`} >
                      <Tab.Container defaultActiveKey={`networks-dags-0`}>
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {data.summaries.dags.map((g: any, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`networks-dags-${ndx2}`}>
                                  {g.name}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              <p>idk dags</p>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </Tab.Pane>
                    <Tab.Pane eventKey={`networks-directed`} >
                      <Tab.Container defaultActiveKey={`networks-directed-0`}>
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {data.summaries.directed.map((g: any, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`networks-directed-${ndx2}`}>
                                  {g.name}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              <p>idk directed</p>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </Tab.Pane>
                    <Tab.Pane eventKey={`networks-undirected`} >
                      <Tab.Container defaultActiveKey={`networks-undirected-0`}>
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {data.summaries.undirected.map((g: any, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`networks-undirected-${ndx2}`}>
                                  {g.name}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              <p>idk undirected</p>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Tab>

          <Tab eventKey="summary" title="summaries">
            <Tab.Container id="left-tabs-example3" defaultActiveKey={`summary-0`}>
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {data.summaries.dags?.map((summary: any, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`summary-${ndx}`}>
                        {summary.name}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    {Object.keys(data.summaries.dags).map((summaryKey, ndx2) => <Tab.Pane key={ndx2} eventKey={`summary-${ndx2}`} >
                      <pre><code>{JSON.stringify(data.summaries.dags[summaryKey].dagReduction, null, 2)}</code></pre>
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

    <footer style={{ position: 'fixed', bottom: 0, right: 0 }}>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto</a></footer>

  </div>)
}

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(Report));
  }
});
