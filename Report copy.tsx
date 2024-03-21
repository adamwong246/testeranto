import React from "react";
import ReactDom from "react-dom/client";
import Graph from "graphology";
import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import 'bootstrap/dist/css/bootstrap.min.css';

import { ITestTypes } from "./src/Project";
import { TesterantoFeatures } from "./src/Features";

import features from "./features.test.mjs";
import tests from "./tests.test.mjs";

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

// type ITree = Record<string, string | ITree>

// const Tree = (props: { tests: ITestTypes[], base?: "" }) => {
//   const tree = {};

//   props.tests.forEach((test) => {
//     const parts = test[0].split("/");
//     let node = tree;

//     for (let i = 0; i < parts.length; i++) {
//       const part = parts[i];
//       if (!node[part]) {
//         node[part] = {};
//       }

//       node = node[part];
//     }
//   });


//   return <ul>
//     {
//       Array.from(fileset).map((f, n) =>
//         <li key={n}>
//           {f}
//         </li>
//       )
//     }
//   </ul>;
// }

export class Report extends React.Component<
  {
    tests: ITestTypes[],
    features: TesterantoFeatures
  }, {
    tests: Record<string, { logs, results }>
  }> {
  constructor(props) {
    super(props);

    this.state = {
      tests: {}
    };
  }

  componentDidMount() {
    this.props.config.tests.map((fPath2, fndx) => {
      const fPath = this.props.config.outdir + '/' + fPath2[0];

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

        < Tabs defaultActiveKey="home" >

          <Tab eventKey="home" title="config">
            <pre id="theProps">{JSON.stringify(this.props, null, 2)}</pre>
          </Tab>

          <Tab eventKey="features" title="features">
            <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
              <Row>
                <Col sm={2}>
                  <Nav variant="pills" className="flex-column">
                    {Object.keys(this.props.config.features.features).map((featureKey, ndx) => <Nav.Item key={ndx}>
                      <Nav.Link eventKey={`feature-${ndx}`}>
                        {featureKey}
                      </Nav.Link>
                    </Nav.Item>)}
                  </Nav>
                </Col>
                <Col sm={6}>
                  <Tab.Content>
                    {Object.keys(this.props.config.features.features).map((featureKey, ndx) => {
                      const feature = this.props.config.features.features[featureKey];
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
                            <pre>{JSON.stringify(this.props.config.features.graphs.dags, null, 2)}</pre>
                          </Tab.Content>
                        </Tab>

                        <Tab eventKey="directed" title="Directed">
                          <Tab.Content>
                            <pre>{JSON.stringify(this.props.config.features.graphs.directed, null, 2)}</pre>
                          </Tab.Content>
                        </Tab>

                        <Tab eventKey="undirected" title="Undirected">
                          <Tab.Content>
                            <pre>{JSON.stringify(this.props.config.features.graphs.undirected, null, 2)}</pre>
                          </Tab.Content>
                        </Tab>

                      </Tabs>
                    </Tab>

                    <Tab eventKey="feature.tests" title="tests">
                      <pre id="theProps">{JSON.stringify(this.props, null, 2)}</pre>
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
                            {this.props.config.features.graphs.dags.map((g, ndx2) => <Nav.Item key={ndx2}>
                              <Nav.Link eventKey={`networks-dags-${ndx2}`}>
                                {g.name}
                              </Nav.Link>
                            </Nav.Item>
                            )}
                          </Nav>
                        </Col>
                        <Col sm={6}>
                          <Tab.Content>

                            <Sigma graph={graphToIGraphData(this.props.config.features.graphs.dags[0].graph)} settings={{ drawEdges: true, clone: false }}>
                              <RelativeSize initialSize={25} />
                              <RandomizeNodePositions />
                            </Sigma>

                            <pre>{JSON.stringify(this.props.config.features.graphs.dags[0].graph, null, 2)}</pre>
                          </Tab.Content>
                        </Col>

                        <Col sm={4}>
                          < Tabs defaultActiveKey="networks.features" >
                            <Tab eventKey="networks.features" title="features">
                              <pre id="theProps">{JSON.stringify(this.props.config.features, null, 2)}</pre>
                            </Tab>

                            <Tab eventKey="feature.tests" title="tests">
                              <pre id="theProps">{JSON.stringify(this.props.config.tests, null, 2)}</pre>
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
                            {this.props.config.features.graphs.directed.map((g, ndx2) => <Nav.Item key={ndx2}>
                              <Nav.Link eventKey={`networks-directed-${ndx2}`}>
                                {g.name}
                              </Nav.Link>
                            </Nav.Item>
                            )}
                          </Nav>
                        </Col>
                        <Col sm={6}>
                          <Tab.Content>

                            <Sigma graph={graphToIGraphData(this.props.config.features.graphs.directed[0].graph)} settings={{ drawEdges: true, clone: false }}>
                              <RelativeSize initialSize={25} />
                              <RandomizeNodePositions />
                            </Sigma>

                            <pre>{JSON.stringify(this.props.config.features.graphs.directed[0].graph, null, 2)}</pre>
                          </Tab.Content>
                        </Col>
                        <Col sm={4}>
                          < Tabs defaultActiveKey="networks.features" >
                            <Tab eventKey="networks.features" title="features">
                              <pre id="theProps">{JSON.stringify(this.props.config.features, null, 2)}</pre>
                            </Tab>

                            <Tab eventKey="feature.tests" title="tests">
                              <pre id="theProps">{JSON.stringify(this.props.config.tests, null, 2)}</pre>
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
                            {this.props.config.features.graphs.undirected.map((g, ndx2) => <Nav.Item key={ndx2}>
                              <Nav.Link eventKey={`networks-undirected-${ndx2}`}>
                                {g.name}
                              </Nav.Link>
                            </Nav.Item>
                            )}
                          </Nav>
                        </Col>
                        <Col sm={6}>
                          <Tab.Content>

                            <Sigma graph={graphToIGraphData(this.props.config.features.graphs.undirected[0].graph)} settings={{ drawEdges: true, clone: false }}>
                              <RelativeSize initialSize={25} />
                              <RandomizeNodePositions />
                            </Sigma>

                            <pre>{JSON.stringify(this.props.config.features.graphs.undirected[0].graph, null, 2)}</pre>
                          </Tab.Content>
                        </Col>
                        <Col sm={4}>
                          < Tabs defaultActiveKey="networks.features" >
                            <Tab eventKey="networks.features" title="features">
                              <pre id="theProps">{JSON.stringify(this.props.config.features, null, 2)}</pre>
                            </Tab>

                            <Tab eventKey="feature.tests" title="tests">
                              <pre id="theProps">{JSON.stringify(this.props.config.tests, null, 2)}</pre>
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
                  {/* <Tree tests={this.props.config.tests} /> */}
                  {/* <Nav variant="pills" className="flex-column">
                    {
                      this.props.config.tests.map((t, ndx) =>
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
                    {this.props.config.tests.map((t, ndx) => {
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
                            <pre>{JSON.stringify(this.props.config.features.graphs.dags, null, 2)}</pre>
                          </Tab.Content>
                        </Tab>

                        <Tab eventKey="directed" title="Directed">
                          <Tab.Content>
                            <pre>{JSON.stringify(this.props.config.features.graphs.directed, null, 2)}</pre>
                          </Tab.Content>
                        </Tab>

                        <Tab eventKey="undirected" title="Undirected">
                          <Tab.Content>
                            <pre>{JSON.stringify(this.props.config.features.graphs.undirected, null, 2)}</pre>
                          </Tab.Content>
                        </Tab>

                      </Tabs>
                    </Tab>

                    <Tab eventKey="tests.features" title="features">
                      <pre id="theProps">{JSON.stringify(this.props.config.features.features, null, 2)}</pre>
                    </Tab>
                  </Tabs>
                </Col>

              </Row>
            </Tab.Container>
          </Tab>

        </Tabs >

        <footer>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto </a></footer>

      </div >

    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("hello from report! mark2");
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(Report, { features, tests }));
  }
});


{/* <Tab.Container id="left-tabs-example" defaultActiveKey="first">
  <Row>
    <Col sm={6} xl={3}>
      <Nav variant="pills" className="flex-column">
        {Object.keys(this.state.tests).sort().map((suiteKey, ndx) => <Nav.Item key={ndx}>
          <Nav.Link eventKey={`suite-${ndx}`}>

            {(this.state.tests[suiteKey].results.fails.length > 0 ?
              `❌` :
              `✅`)
            } {suiteKey.split(`/`).filter((word) => word !== `.`).slice(2).join('/')}

          </Nav.Link>
        </Nav.Item>)}
      </Nav>
    </Col>
    <Col sm={6} xl={9}>
      <Tab.Content>
        {Object.keys(this.state.tests).sort().map((suiteKey, ndx) => <Tab.Pane eventKey={`suite-${ndx}`} key={ndx}>

          {
            (() => {
              return (
                <Tab.Container id="left-tabs-example2" defaultActiveKey={`given-0`}>
                  < Tabs defaultActiveKey="test-drilldown" >
                    <Tab eventKey="test-results" title="results">
                      <pre>{
                        JSON.stringify(this.state.tests[suiteKey].results, null, 2)
                      }</pre>
                    </Tab>
                    <Tab eventKey="test-logs" title="logs">
                      <pre>{this.state.tests[suiteKey].logs}</pre>
                    </Tab>
                  </Tabs>
                </Tab.Container>
              )
            })()
          }

        </Tab.Pane>
        )}
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container> */}