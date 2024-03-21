import React from "react";
import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
const graphToIGraphData = (g) => {
    return {
        nodes: g.nodes().map((n) => {
            return {
                id: n,
                label: n
            };
        }),
        edges: g.mapEdges((id, attributes, source, target) => {
            return {
                id,
                label: id,
                source,
                target,
            };
        })
    };
};
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
export class Report extends React.Component {
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
                return [await logRes.text(), await resultRes.json()];
            }).then(([logs, results]) => {
                const x = this.state;
                x.tests[fPath] = {
                    logs,
                    results
                };
                this.setState(x);
            });
        });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("style", null, `
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
          `),
            React.createElement(Tabs, { defaultActiveKey: "home" },
                React.createElement(Tab, { eventKey: "home", title: "config" },
                    React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props, null, 2))),
                React.createElement(Tab, { eventKey: "features", title: "features" },
                    React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
                        React.createElement(Row, null,
                            React.createElement(Col, { sm: 2 },
                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, Object.keys(this.props.config.features.features).map((featureKey, ndx) => React.createElement(Nav.Item, { key: ndx },
                                    React.createElement(Nav.Link, { eventKey: `feature-${ndx}` }, featureKey))))),
                            React.createElement(Col, { sm: 6 },
                                React.createElement(Tab.Content, null, Object.keys(this.props.config.features.features).map((featureKey, ndx) => {
                                    const feature = this.props.config.features.features[featureKey];
                                    return (React.createElement(Tab.Pane, { eventKey: `feature-${ndx}`, key: ndx },
                                        React.createElement("pre", null, JSON.stringify(feature, null, 2))));
                                }))),
                            React.createElement(Col, { sm: 4 },
                                React.createElement(Tabs, { defaultActiveKey: "feature.networks" },
                                    React.createElement(Tab, { eventKey: "feature.networks", title: "networks" },
                                        React.createElement(Tabs, { defaultActiveKey: "dag" },
                                            React.createElement(Tab, { eventKey: "dag", title: "DAG" },
                                                React.createElement(Tab.Content, null,
                                                    React.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.dags, null, 2)))),
                                            React.createElement(Tab, { eventKey: "directed", title: "Directed" },
                                                React.createElement(Tab.Content, null,
                                                    React.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.directed, null, 2)))),
                                            React.createElement(Tab, { eventKey: "undirected", title: "Undirected" },
                                                React.createElement(Tab.Content, null,
                                                    React.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.undirected, null, 2)))))),
                                    React.createElement(Tab, { eventKey: "feature.tests", title: "tests" },
                                        React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props, null, 2)))))))),
                React.createElement(Tab, { eventKey: "networks", title: "networks" },
                    React.createElement(Tab.Container, { id: "left-tabs-example88", defaultActiveKey: `dag` },
                        React.createElement(Row, null,
                            React.createElement(Tabs, { defaultActiveKey: "dag" },
                                React.createElement(Tab, { eventKey: "dag", title: "DAG" },
                                    React.createElement(Tab.Content, null,
                                        React.createElement(Row, null,
                                            React.createElement(Col, { sm: 2 },
                                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, this.props.config.features.graphs.dags.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                    React.createElement(Nav.Link, { eventKey: `networks-dags-${ndx2}` }, g.name))))),
                                            React.createElement(Col, { sm: 6 },
                                                React.createElement(Tab.Content, null,
                                                    React.createElement(Sigma, { graph: graphToIGraphData(this.props.config.features.graphs.dags[0].graph), settings: { drawEdges: true, clone: false } },
                                                        React.createElement(RelativeSize, { initialSize: 25 }),
                                                        React.createElement(RandomizeNodePositions, null)),
                                                    React.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.dags[0].graph, null, 2)))),
                                            React.createElement(Col, { sm: 4 },
                                                React.createElement(Tabs, { defaultActiveKey: "networks.features" },
                                                    React.createElement(Tab, { eventKey: "networks.features", title: "features" },
                                                        React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.features, null, 2))),
                                                    React.createElement(Tab, { eventKey: "feature.tests", title: "tests" },
                                                        React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.tests, null, 2)))))))),
                                React.createElement(Tab, { eventKey: "directed", title: "Directed" },
                                    React.createElement(Tab.Content, null,
                                        React.createElement(Row, null,
                                            React.createElement(Col, { sm: 2 },
                                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, this.props.config.features.graphs.directed.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                    React.createElement(Nav.Link, { eventKey: `networks-directed-${ndx2}` }, g.name))))),
                                            React.createElement(Col, { sm: 6 },
                                                React.createElement(Tab.Content, null,
                                                    React.createElement(Sigma, { graph: graphToIGraphData(this.props.config.features.graphs.directed[0].graph), settings: { drawEdges: true, clone: false } },
                                                        React.createElement(RelativeSize, { initialSize: 25 }),
                                                        React.createElement(RandomizeNodePositions, null)),
                                                    React.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.directed[0].graph, null, 2)))),
                                            React.createElement(Col, { sm: 4 },
                                                React.createElement(Tabs, { defaultActiveKey: "networks.features" },
                                                    React.createElement(Tab, { eventKey: "networks.features", title: "features" },
                                                        React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.features, null, 2))),
                                                    React.createElement(Tab, { eventKey: "feature.tests", title: "tests" },
                                                        React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.tests, null, 2)))))))),
                                React.createElement(Tab, { eventKey: "undirected", title: "Undirected" },
                                    React.createElement(Tab.Content, null,
                                        React.createElement(Row, null,
                                            React.createElement(Col, { sm: 2 },
                                                React.createElement(Nav, { variant: "pills", className: "flex-column" }, this.props.config.features.graphs.undirected.map((g, ndx2) => React.createElement(Nav.Item, { key: ndx2 },
                                                    React.createElement(Nav.Link, { eventKey: `networks-undirected-${ndx2}` }, g.name))))),
                                            React.createElement(Col, { sm: 6 },
                                                React.createElement(Tab.Content, null,
                                                    React.createElement(Sigma, { graph: graphToIGraphData(this.props.config.features.graphs.undirected[0].graph), settings: { drawEdges: true, clone: false } },
                                                        React.createElement(RelativeSize, { initialSize: 25 }),
                                                        React.createElement(RandomizeNodePositions, null)),
                                                    React.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.undirected[0].graph, null, 2)))),
                                            React.createElement(Col, { sm: 4 },
                                                React.createElement(Tabs, { defaultActiveKey: "networks.features" },
                                                    React.createElement(Tab, { eventKey: "networks.features", title: "features" },
                                                        React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.features, null, 2))),
                                                    React.createElement(Tab, { eventKey: "feature.tests", title: "tests" },
                                                        React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.tests, null, 2)))))))))))),
                React.createElement(Tab, { eventKey: "results", title: "tests" },
                    React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
                        React.createElement(Row, null,
                            React.createElement(Col, { sm: 2 }),
                            React.createElement(Col, { sm: 6 },
                                React.createElement(Tab.Content, null, this.props.config.tests.map((t, ndx) => {
                                    return (React.createElement(Tab.Pane, { eventKey: `feature-${ndx}`, key: ndx },
                                        React.createElement("pre", null, JSON.stringify(t, null, 2))));
                                }))),
                            React.createElement(Col, { sm: 4 },
                                React.createElement(Tabs, { defaultActiveKey: "feature.networks" },
                                    React.createElement(Tab, { eventKey: "feature.networks", title: "networks" },
                                        React.createElement(Tabs, { defaultActiveKey: "dag" },
                                            React.createElement(Tab, { eventKey: "dag", title: "DAG" },
                                                React.createElement(Tab.Content, null,
                                                    React.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.dags, null, 2)))),
                                            React.createElement(Tab, { eventKey: "directed", title: "Directed" },
                                                React.createElement(Tab.Content, null,
                                                    React.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.directed, null, 2)))),
                                            React.createElement(Tab, { eventKey: "undirected", title: "Undirected" },
                                                React.createElement(Tab.Content, null,
                                                    React.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.undirected, null, 2)))))),
                                    React.createElement(Tab, { eventKey: "tests.features", title: "features" },
                                        React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.features.features, null, 2))))))))),
            React.createElement("footer", null,
                "made with \u2764\uFE0F and ",
                React.createElement("a", { href: "https://adamwong246.github.io/testeranto/" }, "testeranto "))));
    }
}
{ /* <Tab.Container id="left-tabs-example" defaultActiveKey="first">
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
</Tab.Container> */
}
