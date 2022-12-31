import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';

import 'bootstrap/dist/css/bootstrap.min.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testerantoConfig = require("../testeranto.config");

export function Report() {

  const [data, setData] = useState<any>([]);

  const getData = () => {
    fetch('testerantoResults.json'
      , {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then(function (response) {
        console.log(response)
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setData(myJson)
      });
  }

  useEffect(() => {
    getData()
  }, [])

  return (<div>
    {
      data.results && data.features && <>
        <Tabs defaultActiveKey="home">
          <Tab eventKey="home" title="Home">
            <p>
              Welcome to testeranto!
            </p>
          </Tab>
          <Tab eventKey="features" title="Features">
            <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {data.features.map((feature, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`feature-${ndx}`}>
                        {feature.name}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    {data.features.map((feature, ndx) => <Tab.Pane eventKey={`feature-${ndx}`} key={ndx}>
                      <p>{feature.description}</p>


                      <Tab.Container id="left-tabs-example5" defaultActiveKey="relations-0">
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {feature.relations.map((summary, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`relations-${ndx2}`}>
                                  {summary.network}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              {feature.relations.map((summary, ndx2) => <Tab.Pane eventKey={`relations-${ndx2}`} key={ndx2}>
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
                    {data.results.map((suite, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`suite-${ndx}`}>
                        {suite.test.name}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    {data.results.map((suite, ndx) => <Tab.Pane eventKey={`suite-${ndx}`} key={ndx}>
                      <p>Status: {JSON.stringify(suite.status, null, 2)}</p>
                      <Tab.Container id="left-tabs-example2" defaultActiveKey={`given-0`}>
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {suite.test.givens.map((g, ndx2) => <Nav.Item key={ndx2}>
                                <Nav.Link eventKey={`given-${ndx2}`}>
                                  {g.name}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              {suite.test.givens.map((g, ndx2) => <Tab.Pane key={ndx2} eventKey={`given-${ndx2}`} >
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
                                <p>features</p>
                                <ul>
                                  {g.features.map((f, ndx3) => <li key={ndx3}>{f.name}</li>)}
                                </ul>
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
                      <pre>{JSON.stringify(summary.summary)}</pre>
                      <Tab.Container id="left-tabs-example4" defaultActiveKey={`summarySteps-0`}>
                        <Row>
                          <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                              {summary.summary.map((summaryStep, ndx3) => <Nav.Item key={ndx3}>
                                <Nav.Link eventKey={`summarySteps-${ndx3}`}>
                                  {summaryStep}
                                </Nav.Link>
                              </Nav.Item>)}
                            </Nav>
                          </Col>
                          <Col sm={9}>
                            <Tab.Content>
                              {summary.summary.map((summaryStep, ndx3) => <Tab.Pane key={ndx3} eventKey={`summarySteps-${ndx3}`} >
                                <pre>{JSON.stringify(summaryStep)}</pre>
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
