import React, { useEffect, useState } from "react";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

import 'bootstrap/dist/css/bootstrap.min.css';

import type { IBaseConfig } from "./IBaseConfig";

export class Report extends React.Component<
  { config: IBaseConfig }, { tests: Record<string, { logs, results }> }> {
  constructor(props) {
    super(props);

    this.state = {
      tests: {}
    };
  }

  componentDidMount() {
    this.props.config.tests.map((fPath, fndx) => {
      console.log("fPath", fPath);

      const logtxt = fPath + "/log.txt";
      const resultsJson = fPath + "/results.json";

      Promise.all([
        fetch(logtxt),
        fetch(resultsJson),
      ]).then(async ([logRes, resultRes]) => {
        return [await logRes.text(), await resultRes.json()]
      }).then(([logs, results]) => {
        const x = this.state;
        x.tests[fPath] = {
          logs,
          results
        };
        this.setState(x)
      })
    })
  }

  render() {
    return (
      <div>
        <style>
          {`
pre, core, p {
  max-width: 30rem;
}
          `}
        </style>

        {/* <pre id="theProps">{JSON.stringify(this.props)}</pre>
        <pre id="theState">{JSON.stringify(this.state)}</pre>
        <p>count: {this.state.count} times</p> */}

        < Tabs defaultActiveKey="home" >


          <Tab eventKey="home" title="config">
            <pre id="theProps">{JSON.stringify(this.state, null, 2)}</pre>
            {/* <pre id="theProps">{JSON.stringify(this.props.config, null, 2)}</pre> */}
          </Tab>

          <Tab eventKey="features" title="features">
            <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {Object.keys(this.props.config.features.features).map((featureKey, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`feature-${ndx}`}>
                        {featureKey}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  {/* <Tab.Content>
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
                  </Tab.Content> */}


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
                              {this.props.config.features.graphs.dags.map((g, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`networks-dags-${ndx2}`}>
                                  {g.name}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              <pre>{JSON.stringify(this.props.config.features.graphs.dags[0].graph, null, 2)}</pre>

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
                              {this.props.config.features.graphs.directed.map((g, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`networks-directed-${ndx2}`}>
                                  {g.name}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              <pre>{JSON.stringify(this.props.config.features.graphs.directed[0].graph, null, 2)}</pre>
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
                              {this.props.config.features.graphs.undirected.map((g: any, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`networks-undirected-${ndx2}`}>
                                  {g.name}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              <pre>{JSON.stringify(this.props.config.features.graphs.undirected[0].graph, null, 2)}</pre>
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


          <Tab eventKey="results" title="tests">
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={6} xl={3}>
                  <Nav variant="pills" className="flex-column">
                    {Object.keys(this.state.tests).sort().map((suiteKey, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`suite-${ndx}`}>
                        {(this.state.tests[suiteKey].results.fails.length > 0 ? `❌ * ${this.state.tests[suiteKey].results.fails.length.toString()}` : `✅ * ${this.state.tests[suiteKey].results.givens.length.toString()}`)} - {suiteKey}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={6} xl={9}>
                  <Tab.Content>
                    {Object.keys(this.state.tests).sort().map((suiteKey, ndx) => <Tab.Pane eventKey={`suite-${ndx}`} key={ndx}>
                      <Tab.Container id="left-tabs-example2" defaultActiveKey={`given-0`}>


                        < Tabs defaultActiveKey="test-drilldown" >


                          <Tab eventKey="test-results" title="results">
                            <Row>
                              <Col sm={3}>
                                <Nav variant="pills" className="flex-column">
                                  {this.state.tests[suiteKey].results.givens.map((g, ndx2) => <Nav.Item key={ndx2}>
                                    <Nav.Link eventKey={`given-${ndx2}`}>
                                      {(g.errors ? `❌` : `✅`)} - {ndx2}
                                    </Nav.Link>
                                  </Nav.Item>)}
                                </Nav>
                              </Col>
                              <Col sm={6}>
                                <Tab.Content>
                                  {this.state.tests[suiteKey].results.givens.map((g, ndx2) => <Tab.Pane key={ndx2} eventKey={`given-${ndx2}`} >
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
                          </Tab>
                          <Tab eventKey="test-logs" title="logs">
                            <pre>{this.state.tests[suiteKey].logs}</pre>
                          </Tab>

                        </Tabs>


                      </Tab.Container>
                    </Tab.Pane>)}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Tab>


        </Tabs >

        <footer style={{ position: 'fixed', bottom: 0, right: 0 }}>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto</a></footer>

      </div >

    );
  }
}

