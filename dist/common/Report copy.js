"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const react_sigma_1 = require("react-sigma");
const Col_1 = __importDefault(require("react-bootstrap/Col"));
const Nav_1 = __importDefault(require("react-bootstrap/Nav"));
const Row_1 = __importDefault(require("react-bootstrap/Row"));
const Tab_1 = __importDefault(require("react-bootstrap/Tab"));
const Tabs_1 = __importDefault(require("react-bootstrap/Tabs"));
require("bootstrap/dist/css/bootstrap.min.css");
const features_test_mjs_1 = __importDefault(require("./features.test.mjs"));
const tests_test_mjs_1 = __importDefault(require("./tests.test.mjs"));
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
class Report extends react_1.default.Component {
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
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("style", null, `
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
            react_1.default.createElement(Tabs_1.default, { defaultActiveKey: "home" },
                react_1.default.createElement(Tab_1.default, { eventKey: "home", title: "config" },
                    react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props, null, 2))),
                react_1.default.createElement(Tab_1.default, { eventKey: "features", title: "features" },
                    react_1.default.createElement(Tab_1.default.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
                        react_1.default.createElement(Row_1.default, null,
                            react_1.default.createElement(Col_1.default, { sm: 2 },
                                react_1.default.createElement(Nav_1.default, { variant: "pills", className: "flex-column" }, Object.keys(this.props.config.features.features).map((featureKey, ndx) => react_1.default.createElement(Nav_1.default.Item, { key: ndx },
                                    react_1.default.createElement(Nav_1.default.Link, { eventKey: `feature-${ndx}` }, featureKey))))),
                            react_1.default.createElement(Col_1.default, { sm: 6 },
                                react_1.default.createElement(Tab_1.default.Content, null, Object.keys(this.props.config.features.features).map((featureKey, ndx) => {
                                    const feature = this.props.config.features.features[featureKey];
                                    return (react_1.default.createElement(Tab_1.default.Pane, { eventKey: `feature-${ndx}`, key: ndx },
                                        react_1.default.createElement("pre", null, JSON.stringify(feature, null, 2))));
                                }))),
                            react_1.default.createElement(Col_1.default, { sm: 4 },
                                react_1.default.createElement(Tabs_1.default, { defaultActiveKey: "feature.networks" },
                                    react_1.default.createElement(Tab_1.default, { eventKey: "feature.networks", title: "networks" },
                                        react_1.default.createElement(Tabs_1.default, { defaultActiveKey: "dag" },
                                            react_1.default.createElement(Tab_1.default, { eventKey: "dag", title: "DAG" },
                                                react_1.default.createElement(Tab_1.default.Content, null,
                                                    react_1.default.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.dags, null, 2)))),
                                            react_1.default.createElement(Tab_1.default, { eventKey: "directed", title: "Directed" },
                                                react_1.default.createElement(Tab_1.default.Content, null,
                                                    react_1.default.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.directed, null, 2)))),
                                            react_1.default.createElement(Tab_1.default, { eventKey: "undirected", title: "Undirected" },
                                                react_1.default.createElement(Tab_1.default.Content, null,
                                                    react_1.default.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.undirected, null, 2)))))),
                                    react_1.default.createElement(Tab_1.default, { eventKey: "feature.tests", title: "tests" },
                                        react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props, null, 2)))))))),
                react_1.default.createElement(Tab_1.default, { eventKey: "networks", title: "networks" },
                    react_1.default.createElement(Tab_1.default.Container, { id: "left-tabs-example88", defaultActiveKey: `dag` },
                        react_1.default.createElement(Row_1.default, null,
                            react_1.default.createElement(Tabs_1.default, { defaultActiveKey: "dag" },
                                react_1.default.createElement(Tab_1.default, { eventKey: "dag", title: "DAG" },
                                    react_1.default.createElement(Tab_1.default.Content, null,
                                        react_1.default.createElement(Row_1.default, null,
                                            react_1.default.createElement(Col_1.default, { sm: 2 },
                                                react_1.default.createElement(Nav_1.default, { variant: "pills", className: "flex-column" }, this.props.config.features.graphs.dags.map((g, ndx2) => react_1.default.createElement(Nav_1.default.Item, { key: ndx2 },
                                                    react_1.default.createElement(Nav_1.default.Link, { eventKey: `networks-dags-${ndx2}` }, g.name))))),
                                            react_1.default.createElement(Col_1.default, { sm: 6 },
                                                react_1.default.createElement(Tab_1.default.Content, null,
                                                    react_1.default.createElement(react_sigma_1.Sigma, { graph: graphToIGraphData(this.props.config.features.graphs.dags[0].graph), settings: { drawEdges: true, clone: false } },
                                                        react_1.default.createElement(react_sigma_1.RelativeSize, { initialSize: 25 }),
                                                        react_1.default.createElement(react_sigma_1.RandomizeNodePositions, null)),
                                                    react_1.default.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.dags[0].graph, null, 2)))),
                                            react_1.default.createElement(Col_1.default, { sm: 4 },
                                                react_1.default.createElement(Tabs_1.default, { defaultActiveKey: "networks.features" },
                                                    react_1.default.createElement(Tab_1.default, { eventKey: "networks.features", title: "features" },
                                                        react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.features, null, 2))),
                                                    react_1.default.createElement(Tab_1.default, { eventKey: "feature.tests", title: "tests" },
                                                        react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.tests, null, 2)))))))),
                                react_1.default.createElement(Tab_1.default, { eventKey: "directed", title: "Directed" },
                                    react_1.default.createElement(Tab_1.default.Content, null,
                                        react_1.default.createElement(Row_1.default, null,
                                            react_1.default.createElement(Col_1.default, { sm: 2 },
                                                react_1.default.createElement(Nav_1.default, { variant: "pills", className: "flex-column" }, this.props.config.features.graphs.directed.map((g, ndx2) => react_1.default.createElement(Nav_1.default.Item, { key: ndx2 },
                                                    react_1.default.createElement(Nav_1.default.Link, { eventKey: `networks-directed-${ndx2}` }, g.name))))),
                                            react_1.default.createElement(Col_1.default, { sm: 6 },
                                                react_1.default.createElement(Tab_1.default.Content, null,
                                                    react_1.default.createElement(react_sigma_1.Sigma, { graph: graphToIGraphData(this.props.config.features.graphs.directed[0].graph), settings: { drawEdges: true, clone: false } },
                                                        react_1.default.createElement(react_sigma_1.RelativeSize, { initialSize: 25 }),
                                                        react_1.default.createElement(react_sigma_1.RandomizeNodePositions, null)),
                                                    react_1.default.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.directed[0].graph, null, 2)))),
                                            react_1.default.createElement(Col_1.default, { sm: 4 },
                                                react_1.default.createElement(Tabs_1.default, { defaultActiveKey: "networks.features" },
                                                    react_1.default.createElement(Tab_1.default, { eventKey: "networks.features", title: "features" },
                                                        react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.features, null, 2))),
                                                    react_1.default.createElement(Tab_1.default, { eventKey: "feature.tests", title: "tests" },
                                                        react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.tests, null, 2)))))))),
                                react_1.default.createElement(Tab_1.default, { eventKey: "undirected", title: "Undirected" },
                                    react_1.default.createElement(Tab_1.default.Content, null,
                                        react_1.default.createElement(Row_1.default, null,
                                            react_1.default.createElement(Col_1.default, { sm: 2 },
                                                react_1.default.createElement(Nav_1.default, { variant: "pills", className: "flex-column" }, this.props.config.features.graphs.undirected.map((g, ndx2) => react_1.default.createElement(Nav_1.default.Item, { key: ndx2 },
                                                    react_1.default.createElement(Nav_1.default.Link, { eventKey: `networks-undirected-${ndx2}` }, g.name))))),
                                            react_1.default.createElement(Col_1.default, { sm: 6 },
                                                react_1.default.createElement(Tab_1.default.Content, null,
                                                    react_1.default.createElement(react_sigma_1.Sigma, { graph: graphToIGraphData(this.props.config.features.graphs.undirected[0].graph), settings: { drawEdges: true, clone: false } },
                                                        react_1.default.createElement(react_sigma_1.RelativeSize, { initialSize: 25 }),
                                                        react_1.default.createElement(react_sigma_1.RandomizeNodePositions, null)),
                                                    react_1.default.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.undirected[0].graph, null, 2)))),
                                            react_1.default.createElement(Col_1.default, { sm: 4 },
                                                react_1.default.createElement(Tabs_1.default, { defaultActiveKey: "networks.features" },
                                                    react_1.default.createElement(Tab_1.default, { eventKey: "networks.features", title: "features" },
                                                        react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.features, null, 2))),
                                                    react_1.default.createElement(Tab_1.default, { eventKey: "feature.tests", title: "tests" },
                                                        react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.tests, null, 2)))))))))))),
                react_1.default.createElement(Tab_1.default, { eventKey: "results", title: "tests" },
                    react_1.default.createElement(Tab_1.default.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
                        react_1.default.createElement(Row_1.default, null,
                            react_1.default.createElement(Col_1.default, { sm: 2 }),
                            react_1.default.createElement(Col_1.default, { sm: 6 },
                                react_1.default.createElement(Tab_1.default.Content, null, this.props.config.tests.map((t, ndx) => {
                                    return (react_1.default.createElement(Tab_1.default.Pane, { eventKey: `feature-${ndx}`, key: ndx },
                                        react_1.default.createElement("pre", null, JSON.stringify(t, null, 2))));
                                }))),
                            react_1.default.createElement(Col_1.default, { sm: 4 },
                                react_1.default.createElement(Tabs_1.default, { defaultActiveKey: "feature.networks" },
                                    react_1.default.createElement(Tab_1.default, { eventKey: "feature.networks", title: "networks" },
                                        react_1.default.createElement(Tabs_1.default, { defaultActiveKey: "dag" },
                                            react_1.default.createElement(Tab_1.default, { eventKey: "dag", title: "DAG" },
                                                react_1.default.createElement(Tab_1.default.Content, null,
                                                    react_1.default.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.dags, null, 2)))),
                                            react_1.default.createElement(Tab_1.default, { eventKey: "directed", title: "Directed" },
                                                react_1.default.createElement(Tab_1.default.Content, null,
                                                    react_1.default.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.directed, null, 2)))),
                                            react_1.default.createElement(Tab_1.default, { eventKey: "undirected", title: "Undirected" },
                                                react_1.default.createElement(Tab_1.default.Content, null,
                                                    react_1.default.createElement("pre", null, JSON.stringify(this.props.config.features.graphs.undirected, null, 2)))))),
                                    react_1.default.createElement(Tab_1.default, { eventKey: "tests.features", title: "features" },
                                        react_1.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props.config.features.features, null, 2))))))))),
            react_1.default.createElement("footer", null,
                "made with \u2764\uFE0F and ",
                react_1.default.createElement("a", { href: "https://adamwong246.github.io/testeranto/" }, "testeranto "))));
    }
}
exports.Report = Report;
document.addEventListener("DOMContentLoaded", function () {
    console.log("hello from report! mark2");
    const elem = document.getElementById("root");
    if (elem) {
        client_1.default.createRoot(elem).render(react_1.default.createElement(Report, { features: features_test_mjs_1.default, tests: tests_test_mjs_1.default }));
    }
});
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
