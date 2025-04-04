import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
// type ICollation = {
//   name: string;
//   runTime: IRunTime;
//   tr: {
//     ports: number;
//   };
//   sidecars: ITestTypes[];
//   status: string;
//   staticAnalysis: string;
//   typeErrors: string;
//   bddErrors: string;
// };
// type ICollations = ICollation[];
const StepPane = ({ step }) => {
    return React.createElement("div", null,
        React.createElement("pre", null,
            React.createElement("code", null, JSON.stringify(step, null, 2))));
};
const TestPane = ({ given }) => {
    return React.createElement("div", null,
        "    ",
        React.createElement(Tab.Container, { id: "TestPane-tabs", defaultActiveKey: "first" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 3 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: `bdd-features` }, "features"),
                            ...given.whens.map((w, ndx) => React.createElement(Nav.Link, { eventKey: `bdd-when-${ndx}` },
                                "When ",
                                w.name,
                                " ",
                                w.error && "!")),
                            ...given.thens.map((t, ndx) => React.createElement(Nav.Link, { eventKey: `bdd-then-${ndx}` },
                                "Then ",
                                t.name,
                                " ",
                                t.error && "!")),
                            React.createElement(Nav.Link, { eventKey: `bdd-errors` }, "errors")))),
                React.createElement(Col, { sm: 9 },
                    React.createElement(Tab.Content, null,
                        React.createElement(Tab.Pane, { eventKey: `bdd-features` },
                            React.createElement("pre", null,
                                React.createElement("code", null, JSON.stringify(given.features, null, 2)))),
                        ...given.whens.map((w, ndx) => React.createElement(Tab.Pane, { eventKey: `bdd-when-${ndx}` },
                            React.createElement(StepPane, { step: w }))),
                        ...given.thens.map((t, ndx) => React.createElement(Tab.Pane, { eventKey: `bdd-then-${ndx}` },
                            React.createElement(StepPane, { step: t }))),
                        React.createElement(Tab.Pane, { eventKey: `bdd-errors` },
                            React.createElement("pre", null,
                                React.createElement("code", null, JSON.stringify(given.error, null, 2)))))))));
};
const BddPage = () => {
    const [configs, setConfigs] = useState();
    useEffect(() => {
        (async () => {
            fetch('http://localhost:8080/testeranto.json')
                .then(response => response.json())
                .then(json => {
                setConfigs(json);
            })
                .catch(error => console.error(error));
        })();
    }, []);
    const [bddErrors, setBddErrors] = useState();
    useEffect(() => {
        (async () => {
            setBddErrors(await (await fetch(`tests.json`)).json());
        })();
    }, [configs]);
    if (!configs || !bddErrors) {
        return React.createElement("div", null, "loading...");
    }
    // const collated: ICollations = configs.tests.map((c) => {
    //   return {
    //     ...bigBoard[c[0]],
    //     name: c[0],
    //     runTime: c[1],
    //     tr: c[2],
    //     sidecars: c[3],
    //     staticAnalysis: staticAnalysis[c[0]],
    //     typeErrors: typeErrors[c[0]],
    //     bddErrors: bddErrors[c[0]],
    //   } as ICollation
    // });
    // console.log(collated);
    // return <table>
    //   <tr>
    //     <td>name</td>
    //     <td>run time</td>
    //     <td>BDD errors</td>
    //     <td>Lint errors</td>
    //     <td>Type errors</td>
    //   </tr>
    //   {
    //     ...collated.map((c) => {
    //       return <tr>
    //         <td>{c.name}</td>
    //         <td>{c.runTime}</td>
    //         <td><a href={`${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/littleBoard.html`}>{c.bddErrors}</a></td>
    //         <td><a href={`${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/lint_errors.json`}>{c.staticAnalysis}</a></td>
    //         <td><a href={`${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/type_errors.txt`}>{c.typeErrors}</a></td>
    //       </tr>
    //     })
    //   }
    // </table>
    return React.createElement("div", null,
        "  ",
        React.createElement(Row, null,
            React.createElement(Col, { sm: 12 },
                React.createElement("h2", null, bddErrors.name))),
        React.createElement(Row, null,
            React.createElement(Tab.Container, { id: "root-tab-container", defaultActiveKey: "first" },
                React.createElement(Row, null,
                    React.createElement(Col, { sm: 3 },
                        React.createElement(Nav, { variant: "pills", className: "flex-column" }, ...bddErrors.givens.map((g) => React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: g.key },
                                g.key,
                                ": Given ",
                                g.name))))),
                    React.createElement(Col, { sm: 9 },
                        React.createElement(Tab.Content, null, ...bddErrors.givens.map((g) => React.createElement(Tab.Pane, { eventKey: g.key },
                            React.createElement(TestPane, { given: g })))))))));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(BddPage, {}, []));
    }
});
console.log("hello BddPage!");
