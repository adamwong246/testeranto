import React, { useEffect, useState } from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import 'bootstrap/dist/css/bootstrap.min.css';

const queryString = window.location.search;

// Create a URLSearchParams object
const urlParams = new URLSearchParams(queryString);
console.log("urlParams", urlParams.has(
  "local"
))
// Get the value of a specific parameter
const isLocal = urlParams.get("local");

const urlFixer = (url: string): string => {
  if (isLocal) {
    return `file:///Users/adam/Code/kokomoBay/${url}`;
  } else {
    return `https://chromapdx.github.io/kokomoBay/${url}`;
  }

}

const TextTab = (props: { url: string }) => {

  const [text, setText] = useState('');

  useEffect(() => {
    fetch(props.url) // Replace with your API endpoint
      .then(response => response.text())
      .then(data => setText(data))
      .catch(error => console.error('Error fetching text:', error));
  }, []);

  return <code><pre>{text}</pre></code>
}

export default () => {

  // const [state, setState] = useState<{
  //   tests: ITestTypes[],
  //   buildDir: string,
  //   features: TesterantoFeatures
  //   results: any
  // }>({
  //   tests: [],
  //   buildDir: "",
  //   features: new TesterantoFeatures({}, {
  //     undirected: [],
  //     directed: [],
  //     dags: []
  //   }),
  //   results: {}
  // });

  // const [tests, setTests] = useState<
  //   {
  //     tests: ITestTypes[],
  //     buildDir: string,
  //   }

  // >({
  //   tests: [],
  //   buildDir: ""
  // });

  // const [features, setFeatures] = useState<TesterantoFeatures>(
  //   new TesterantoFeatures({}, {
  //     undirected: [],
  //     directed: [],
  //     dags: []
  //   })
  // );

  // const [results, setResults] = useState<Record<string, { exitcode, log, testresults, manifest }>>(
  //   {}
  // );

  // const importState = async () => {
  //   const features = await import('features.test.js');
  //   const config = await (await fetch("./testeranto.json")).json();
  //   const results = await Promise.all(config.tests.map((test) => {
  //     return new Promise(async (res, rej) => {
  //       const src: string = test[0];
  //       const runtime: IRunTime = test[1];
  //       const s: string = [tests.buildDir, runtime as string].concat(src.split(".").slice(0, - 1).join(".")).join("/");
  //       const exitcode = await (await fetch(config.buildDir + "/" + s + "/exitcode")).text()
  //       const log = await (await fetch(config.buildDir + "/" + s + "/log.txt")).text()
  //       const testresults = await (await fetch(config.buildDir + "/" + s + "/tests.json")).json()
  //       const manifest = await (await fetch(config.buildDir + "/" + s + "/manifest.json")).json()

  //       res({ src, exitcode, log, testresults, manifest })
  //     })
  //   }))

  //   setState({ tests: config.tests as any, results, features: features as any, buildDir: config.buildDir })
  // };

  // const importFeatures = async () => {
  //   const module = await import('features.test.js');
  //   setFeatures(module.default);
  // };

  // const importTests = async () => {
  //   const x = await fetch("./testeranto.json")
  //   const y = await x.json();
  //   setTests(y as any);
  // };

  // useEffect(() => { importState(); }, []);

  // useEffect(() => { importFeatures(); }, []);
  // useEffect(() => { importTests(); }, []);

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
    <Tab.Container id="left-tabs-example5" defaultActiveKey="examples-0">
      <Row>
        <Col sm={3} lg={2}>
          <Nav variant="pills" className="flex-column">

            <Nav.Link eventKey={`manual-example-rectangle`}>
              RECTANGLE
            </Nav.Link>

            <Nav.Link eventKey={`manual-example-ClassicalComponent`}>
              ClassicalComponent
            </Nav.Link>

            <Nav.Link eventKey={`manual-example-react+sol`}>
              React and solidity
            </Nav.Link>

            {/* {Object.keys(features.features).map((featureKey, ndx) => <Nav.Item key={ndx}>
              <Nav.Link eventKey={`feature-${ndx}`}>
                {featureKey}
              </Nav.Link>
            </Nav.Item>)} */}
          </Nav>
        </Col>

        <Col sm={3} lg={2}>
          <Tab.Content>

            <Tab.Pane eventKey={`manual-example-rectangle`} key={`manual-example-rectangle`}>
              <pre>
                In this contrived example, we are testing the Rectangle class. Node that because it uses no web-specific, nor node-specific language features, it can be run in either runtime, thought it more efficient and reasonable to test in node.
              </pre>
            </Tab.Pane>

            <Tab.Pane eventKey={`manual-example-ClassicalComponent`} key={`manual-example-ClassicalComponent`}>
              <pre>Testing a react component with the react-test-renderer package.</pre>
            </Tab.Pane>

            <Tab.Pane eventKey={`manual-example-react+sol`} key={`manual-example-react+sol`}>
              <pre>Testing a react component which is backed by a solidity contract. This test is performed _on_ the server but but _through_ the browser. The react element is renderer into an chromium window and accessed by puppeteer.</pre>
            </Tab.Pane>


          </Tab.Content>
        </Col>


        <Col >
          <Tab.Content>

            <Tab.Pane eventKey={`manual-example-rectangle`} key={`manual-example-rectangle`}>


              <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="Rectangle.ts" title="Rectangle.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.ts" />
                </Tab>
                <Tab eventKey="Rectangle.test.specification.ts" title="Rectangle.test.specification.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.specification.ts" />
                </Tab>
                <Tab eventKey="Rectangle.test.shape.ts" title="Rectangle.test.shape.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.shape.ts" />
                </Tab>
                <Tab eventKey="Rectangle.test.implementation.ts" title="Rectangle.test.implementation.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.implementation.ts" />
                </Tab>

                <Tab eventKey="Rectangle.test.interface.ts" title="Rectangle.test.interface.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.interface.ts" />
                </Tab>
                <Tab eventKey="Rectangle.config" title="Rectangle.config">
                  <code><pre>{`
...

// Run the test in node
"./src/Rectangle/Rectangle.test.node.ts",
"node",
{ ports: 0 },
[],
],

// Run the same test in chromium too!
"./src/Rectangle/Rectangle.test.web.ts",
"web",
{ ports: 0 },
[],
],

...
              `}</pre></code>
                </Tab>
              </Tabs>


            </Tab.Pane>
            <Tab.Pane eventKey={`manual-example-ClassicalComponent`} key={`manual-example-ClassicalComponent`}>


              <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="ClassicalComponent/index.tsx" title="ClassicalComponent/index.tsx">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/ClassicalComponent/index.tsx" />
                </Tab>
                <Tab eventKey="ClassicalComponent/test.specification.ts" title="ClassicalComponent/test.specification.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/ClassicalComponent/test.specification.ts" />
                </Tab>
                <Tab eventKey="ClassicalComponent/test.shape.ts" title="ClassicalComponent/test.shape.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/ClassicalComponent/test.shape.ts" />
                </Tab>
                <Tab eventKey="ClassicalComponent/react-test-renderer/test.implementation.ts" title="ClassicalComponent/react-test-renderer/test.implementation.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/ClassicalComponent/react-test-renderer/test.implementation.ts" />
                </Tab>

                <Tab eventKey="react-test-renderer/test.interface.ts" title="react-test-renderer/test.interface.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/node_modules/testeranto/src/SubPackages/react-test-renderer/component/interface.ts" />
                </Tab>

                {/* <Tab eventKey="Rectangle.test.shape.ts" title="Rectangle.test.shape.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.shape.ts" />
                </Tab>
                <Tab eventKey="Rectangle.test.implementation.ts" title="Rectangle.test.implementation.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.implementation.ts" />
                </Tab>
                <Tab eventKey="Rectangle.test.specification.ts" title="Rectangle.test.specification.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.specification.ts" />
                </Tab>
                <Tab eventKey="Rectangle.test.interface.ts" title="Rectangle.test.interface.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.interface.ts" />
                </Tab>
                <Tab eventKey="Rectangle.config" title="Rectangle.config">
                  <code><pre>{`
...

// Run the test in node
"./src/Rectangle/Rectangle.test.node.ts",
"node",
{ ports: 0 },
[],
],

// Run the same test in chromium too!
"./src/Rectangle/Rectangle.test.web.ts",
"web",
{ ports: 0 },
[],
],

...
              `}</pre></code>
                </Tab> */}
              </Tabs>

            </Tab.Pane>
            <Tab.Pane eventKey={`manual-example-react+sol`} key={`manual-example-react+sol`}>


              <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="contracts/MyBaseContract.sol" title="MyBaseContract.sol">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/contracts/MyBaseContract.sol" />
                </Tab>
                <Tab eventKey="src/MyFirstContractUI.tsx" title="MyFirstContractUI.tsx">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/MyFirstContractUI.tsx" />
                </Tab>

                <Tab eventKey="src/MyFirstContract.specification.test.ts" title="MyFirstContract.specification.test.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/MyFirstContract.specification.test.ts" />
                </Tab>
                <Tab eventKey="src/MyFirstContract.solidity-react.interface.test.ts" title="MyFirstContract.solidity-react.interface.test.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/MyFirstContract.solidity-react.interface.test.ts" />
                </Tab>
                <Tab eventKey="src/MyFirstContract.solidity-react.implementation.test.ts" title="MyFirstContract.solidity-react.implementation.test.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/MyFirstContract.solidity-react.implementation.test.ts" />
                </Tab>
                <Tab eventKey="src/MyFirstContract.solidity-react.shape.test.ts" title="MyFirstContract.solidity-react.shape.test.ts">
                  <TextTab url={urlFixer("src/MyFirstContract.solidity-react.shape.test.ts")} />
                </Tab>

                <Tab eventKey="MyFirstContract.solidity-react-example-jpg" title="screenshot">
                  {/* <img src="file:///Users/adam/Code/kokomoBay/docs/node/src/MyFirstContract.solidity-react.testeranto/suite-0/given-test1/when/0/afterEach/andWhen.jpg" alt="Italian Trulli" /> */}
                  <img src={urlFixer("docs/node/src/MyFirstContract.solidity-react.testeranto/suite-0/given-test1/when/0/afterEach/andWhen.jpg")} />
                </Tab>





                {/* <Tab eventKey="Rectangle.test.shape.ts" title="Rectangle.test.shape.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.shape.ts" />
                </Tab>
                <Tab eventKey="Rectangle.test.implementation.ts" title="Rectangle.test.implementation.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.implementation.ts" />
                </Tab>
                <Tab eventKey="Rectangle.test.specification.ts" title="Rectangle.test.specification.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.specification.ts" />
                </Tab>
                <Tab eventKey="Rectangle.test.interface.ts" title="Rectangle.test.interface.ts">
                  <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.interface.ts" />
                </Tab>
                <Tab eventKey="Rectangle.config" title="Rectangle.config">
                  <code><pre>{`
...

// Run the test in node
"./src/Rectangle/Rectangle.test.node.ts",
"node",
{ ports: 0 },
[],
],

// Run the same test in chromium too!
"./src/Rectangle/Rectangle.test.web.ts",
"web",
{ ports: 0 },
[],
],

...
              `}</pre></code>
                </Tab> */}
              </Tabs>

            </Tab.Pane>
          </Tab.Content>
        </Col>


      </Row>
    </Tab.Container>
  );
};
