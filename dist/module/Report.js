import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { TesterantoFeatures } from "./Features";
// import { ITestTypes } from "./Project";
// import { TesterantoFeatures } from "./Features";
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(Report, {}));
    }
});
const Report = () => {
    const [tests, setTests] = useState({ tests: [] });
    const [features, setFeatures] = useState({
        features: new TesterantoFeatures({}, {
            undirected: [],
            directed: [],
            dags: []
        })
    });
    useEffect(() => {
        const importTests = async () => {
            const module = await import('tests.test.js');
            setTests(module.default);
        };
        importTests();
    }, []);
    useEffect(() => {
        const importFeatures = async () => {
            const module = await import('features.test.js');
            setFeatures(module.default);
        };
        importFeatures();
    }, []);
    return (React.createElement("div", null,
        React.createElement("pre", null, JSON.stringify(features, null, 2)),
        React.createElement("pre", null, JSON.stringify(tests, null, 2)),
        React.createElement("div", null, "This is my functional component!")));
};
// export class Report extends React.Component<
//   {
//     // tests: ITestTypes[],
//     // features: TesterantoFeatures
//   }, {
//     tests: Record<string, { logs, results }>
//   }> {
//   constructor(props) {
//     super(props);
//     // import tests from "/tests.test.js";
//     // // eslint-disable-next-line @typescript-eslint/no-var-requires
//     // const tests = require("/tests.test.js");
//     // // eslint-disable-next-line @typescript-eslint/no-var-requires
//     // const features = require("/features.test.js");
//     // console.log("test, features", tests, features)
//     this.state = {
//       tests: {}
//     };
//   }
//   render() {
//     return (
//       <div>
//         <style>
//           {`
// pre, code, p {
//   max-width: 30rem;
// }
// footer {
//   background-color: lightgray;
//   margin: 0.5rem;
//   padding: 0.5rem;
//   position: fixed;
//   bottom: 0;
//   right: 0;
// }
//           `}
//         </style>
//         <h1>hello report</h1>
//         <footer>made with ❤️ and <a href="https://adamwong246.github.io/testeranto/" >testeranto </a></footer>
//       </div >
//     );
//   }
// }
