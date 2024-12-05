// import React, { useEffect, useState } from "react";

// import Col from 'react-bootstrap/Col';
// import Nav from 'react-bootstrap/Nav';
// import Row from 'react-bootstrap/Row';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';

// import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';

// import 'bootstrap/dist/css/bootstrap.min.css';

// import { TesterantoFeatures } from "./Features.js";
// import { IRunTime, ITestTypes } from "./lib/types.js";

// // type IGraphData = {
// //   nodes: { id: string, label: string }[],
// //   edges: { id: string, source: string, target: string, label: string }[]
// // }

// // const graphToIGraphData: (g: Graph) => IGraphData = (g) => {
// //   return {
// //     nodes: g.nodes().map((n) => {
// //       return {
// //         id: n,
// //         label: n
// //       }
// //     }),
// //     edges: g.mapEdges((id, attributes, source, target) => {
// //       return {
// //         id,
// //         label: id,
// //         source,
// //         target,
// //       }
// //     })
// //   }
// // }

// // document.addEventListener("DOMContentLoaded", function () {
// //   const elem = document.getElementById("root");
// //   if (elem) {
// //     ReactDom.createRoot(elem).render(React.createElement(ManualExamples, {}));
// //   }
// // });

// const TextTab = (props: { url: string }) => {

//   const [text, setText] = useState('');

//   useEffect(() => {
//     fetch(props.url) // Replace with your API endpoint
//       .then(response => response.text())
//       .then(data => setText(data))
//       .catch(error => console.error('Error fetching text:', error));
//   }, []);

//   return <code><pre>{text}</pre></code>
// }

// export default () => {

//   // const [state, setState] = useState<{
//   //   tests: ITestTypes[],
//   //   buildDir: string,
//   //   features: TesterantoFeatures
//   //   results: any
//   // }>({
//   //   tests: [],
//   //   buildDir: "",
//   //   features: new TesterantoFeatures({}, {
//   //     undirected: [],
//   //     directed: [],
//   //     dags: []
//   //   }),
//   //   results: {}
//   // });

//   // const [tests, setTests] = useState<
//   //   {
//   //     tests: ITestTypes[],
//   //     buildDir: string,
//   //   }

//   // >({
//   //   tests: [],
//   //   buildDir: ""
//   // });

//   // const [features, setFeatures] = useState<TesterantoFeatures>(
//   //   new TesterantoFeatures({}, {
//   //     undirected: [],
//   //     directed: [],
//   //     dags: []
//   //   })
//   // );

//   // const [results, setResults] = useState<Record<string, { exitcode, log, testresults, manifest }>>(
//   //   {}
//   // );

//   // const importState = async () => {
//   //   const features = await import('features.test.js');
//   //   const config = await (await fetch("./testeranto.json")).json();
//   //   const results = await Promise.all(config.tests.map((test) => {
//   //     return new Promise(async (res, rej) => {
//   //       const src: string = test[0];
//   //       const runtime: IRunTime = test[1];
//   //       const s: string = [tests.buildDir, runtime as string].concat(src.split(".").slice(0, - 1).join(".")).join("/");
//   //       const exitcode = await (await fetch(config.buildDir + "/" + s + "/exitcode")).text()
//   //       const log = await (await fetch(config.buildDir + "/" + s + "/log.txt")).text()
//   //       const testresults = await (await fetch(config.buildDir + "/" + s + "/tests.json")).json()
//   //       const manifest = await (await fetch(config.buildDir + "/" + s + "/manifest.json")).json()

//   //       res({ src, exitcode, log, testresults, manifest })
//   //     })
//   //   }))

//   //   setState({ tests: config.tests as any, results, features: features as any, buildDir: config.buildDir })
//   // };

//   // const importFeatures = async () => {
//   //   const module = await import('features.test.js');
//   //   setFeatures(module.default);
//   // };

//   // const importTests = async () => {
//   //   const x = await fetch("./testeranto.json")
//   //   const y = await x.json();
//   //   setTests(y as any);
//   // };

//   // useEffect(() => { importState(); }, []);

//   // useEffect(() => { importFeatures(); }, []);
//   // useEffect(() => { importTests(); }, []);

//   // useEffect(() => {
//   //   const collateResults = async () => {
//   //     console.log("collating", tests, features);
//   //     const r = tests.tests.reduce(async (p, test) => {
//   //       const src: string = test[0];
//   //       const runtime: IRunTime = test[1];
//   //       console.log(runtime)
//   //       const s: string = [tests.buildDir, runtime as string].concat(src.split(".").slice(0, - 1).join(".")).join("/");
//   //       const exitcode = await (await fetch(s + "/exitcode")).text()
//   //       const log = await (await fetch(s + "/log.txt")).text()
//   //       const testresults = await (await fetch(s + "/tests.json")).text()

//   //       p[src] = { exitcode, log, testresults }
//   //     }, {});

//   //     setResults(r);

//   //   };
//   //   collateResults();
//   // }, []);

//   // console.log("state.results", state.results);

//   return (
//     <div>

//       <Row>
//         <Col sm={2} lg={1}>
//           <Nav variant="pills" className="flex-column">
//             <Nav.Link eventKey={`manual-example-rectangle`}>
//               RECTANGLE
//             </Nav.Link>

//             <Nav.Link eventKey={`manual-example-ClassicalComponent`}>
//               ClassicalComponent
//             </Nav.Link>

//           </Nav>
//         </Col>
//         <Col sm={10}>
//           <Tabs
//             defaultActiveKey="profile"
//             id="uncontrolled-tab-example"
//             className="mb-3"
//           >
//             <Tab eventKey="Rectangle.ts" title="Rectangle.ts">
//               <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.ts" />
//             </Tab>
//             <Tab eventKey="Rectangle.test.shape.ts" title="Rectangle.test.shape.ts">
//               <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.shape.ts" />
//             </Tab>
//             <Tab eventKey="Rectangle.test.implementation.ts" title="Rectangle.test.implementation.ts">
//               <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.implementation.ts" />
//             </Tab>
//             <Tab eventKey="Rectangle.test.specification.ts" title="Rectangle.test.specification.ts">
//               <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.specification.ts" />
//             </Tab>
//             <Tab eventKey="Rectangle.test.interface.ts" title="Rectangle.test.interface.ts">
//               <TextTab url="file:///Users/adam/Code/kokomoBay/src/Rectangle.test.interface.ts" />
//             </Tab>
//             <Tab eventKey="Rectangle.config" title="Rectangle.config">
//               <code><pre>{`
// ...

// // Run the test in node
// "./src/Rectangle/Rectangle.test.node.ts",
// "node",
// { ports: 0 },
// [],
// ],

// // Run the same test in chromium too!
// "./src/Rectangle/Rectangle.test.web.ts",
// "web",
// { ports: 0 },
// [],
// ],

// ...
//               `}</pre></code>
//             </Tab>
//           </Tabs>
//         </Col>


//       </Row>
//     </div >
//   );
// };
