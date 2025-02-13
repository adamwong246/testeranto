import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Graph from "graphology";
// import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';

import 'bootstrap/dist/css/bootstrap.min.css';
import { TesterantoFeatures } from "./Features";
import { IRunTime } from "./lib/types";

type ITaskManFeatures = { _id, title };

const Report = () => {

  const [state, setState] = useState<{
    tests: any[],
    buildDir: string,
    // features: TesterantoFeatures
    results: any
  }>({
    tests: [],
    buildDir: "",
    // features: new TesterantoFeatures({}, {
    //   undirected: [],
    //   directed: [],
    //   dags: []
    // }),
    results: {}
  });

  const [tests, setTests] = useState<
    {
      tests: any[],
      buildDir: string,
    }

  >
    ({
      tests: [],
      buildDir: ""
    });

  const [features, setFeatures] = useState<ITaskManFeatures[]>(
    []
  );

  // const [results, setResults] = useState<Record<string, { exitcode, log, testresults, manifest }>>(
  //   {}
  // );

  const importResults = async () => {
    // const features = await import('features.test.js');
    const config = await (await fetch("./testeranto.json")).json();
    const results = await Promise.all(config.tests.map((test) => {
      return new Promise(async (res, rej) => {
        const src: string = test[0];
        const runtime: IRunTime = test[1];
        const s: string = [tests.buildDir, runtime as string].concat(src.split(".").slice(0, - 1).join(".")).join("/");
        const exitcode = await (await fetch(config.outdir + "/" + s + "/exitcode")).text()
        const log = await (await fetch(config.outdir + "/" + s + "/log.txt")).text()
        const testresults = await (await fetch(config.outdir + "/" + s + "/tests.json")).json()
        const manifest = await (await fetch(config.outdir + "/" + s + "/manifest.json")).json()

        res({ src, exitcode, log, testresults, manifest })
      })
    }))

    setState({ tests: config.tests as any, results, buildDir: config.buildDir })
  };

  const importFeatures = async () => {
    fetch('http://localhost:3000/features')
      .then(response => response.json())
      .then(json => setFeatures(json))
      .catch(error => console.error(error));

  };
  useEffect(() => { importFeatures(); }, []);

  const importTests = async () => {
    const x = await fetch("./testeranto.json")
    const y = await x.json();
    setTests(y as any);
  };

  useEffect(() => { importResults(); }, []);

  // useEffect(() => { importFeatures(); }, []);
  useEffect(() => { importTests(); }, []);

  // useEffect(() => {
  //   const collateResults = async () => {
  //     console.log("collating", tests, features);
  //     const r = tests.tests.reduce(async (p, test) => {
  //       const src: string = test[0];
  //       const runtime: IRunTime = test[1];
  //       console.log(runtime)
  //       const s: string = [tests.buildDir, runtime as string].concat(src.split(".").slice(0, - 1).join(".")).join("/");
  //       const exitcode = await (await fetch(s + "/exitcode")).text()
  //       const log = await (await fetch(s + "/log.txt")).text()
  //       const testresults = await (await fetch(s + "/tests.json")).text()

  //       p[src] = { exitcode, log, testresults }
  //     }, {});

  //     setResults(r);

  //   };
  //   collateResults();
  // }, []);

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

      {/* <pre>{JSON.stringify(feat ures, null, 2)}</pre> */}


      < Tabs defaultActiveKey="manual" >

        <Tab eventKey="manual" title="manual">
          <article>
            <h1>Testeranto</h1>
            <h2>What is testeranto?</h2>
            <p>
              Testeranto is a novel testing framework for typescript project. Inspired by Behavior Driven Development, testeranto allows you to wrap you typescript with gherkin-like semantics, producing a report in the form of a static website. Testeranto runs it's tests both in node and chromium.
            </p>
          </article>
        </Tab>

        <Tab eventKey="features" title="features">
          <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
            <Row>
              <Col sm={2}>
                <Nav variant="pills" className="flex-column">
                  {(features).map((feature, ndx) => <Nav.Item key={ndx}>
                    <Nav.Link eventKey={`feature-${ndx}`}>
                      {feature.title}
                    </Nav.Link>
                  </Nav.Item>)}
                </Nav>
              </Col>
              <Col sm={6}>
                <Tab.Content>
                  {(features).map((feature, ndx) => {
                    // const feature = features[featureKey];
                    return (
                      <Tab.Pane eventKey={`feature-${ndx}`} key={ndx}>
                        <pre>{JSON.stringify(feature, null, 2)}</pre>
                      </Tab.Pane>
                    )
                  }
                  )}
                </Tab.Content>
              </Col>

              {/* <Col sm={4}>
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
            </Col>  */}

            </Row>
          </Tab.Container>
        </Tab>



        <Tab eventKey="tests" title="tests">
          <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
            <Row>
              <Col sm={4}>
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


            </Row>
          </Tab.Container>
        </Tab>

        <Tab eventKey="kanban" title="kanban">
          <article>
            <h1>kanban goes here</h1>
          </article>
        </Tab>

        <Tab eventKey="gantt" title="gantt">
          <article>
            <h1>gantt goes here</h1>
          </article>
        </Tab>

      </Tabs>
      <footer>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto </a></footer>

    </div >
  );
};

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(Report, {}));
  }
});
