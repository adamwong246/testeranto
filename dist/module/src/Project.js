/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab, Table } from "react-bootstrap";
import { Footer } from "./Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
// type ICollation = {
//   name: string;
//   runTime: IRunTime;
//   tr: {
//     ports: number;
//   };
//   sidecars: ITestTypes[];
//   staticAnalysis: number | "?";
//   typeErrors: number | "?";
//   bddErrors: number | "?";
//   prompt: string | "?";
// };
// type ICollations = ICollation[];
const ExternalFeatures = ({ summary }) => {
    return React.createElement("div", null,
        React.createElement(Row, null,
            React.createElement(Tab.Container, { id: "external-features-tab-container" },
                React.createElement(Row, null,
                    React.createElement(Col, { sm: 1 },
                        React.createElement(Nav, { variant: "pills", className: "flex-column" },
                            React.createElement(Nav.Item, null,
                                React.createElement(Nav.Link, { eventKey: "log" }, "log"),
                                React.createElement(Nav.Link, { eventKey: "steps" }, "steps")))),
                    React.createElement(Col, { sm: 11 },
                        React.createElement(Tab.Content, null,
                            React.createElement(Tab.Pane, { eventKey: "log" }),
                            React.createElement(Tab.Pane, { eventKey: "steps" },
                                React.createElement(Tab.Container, { id: "secondary-tab-container", defaultActiveKey: "first" },
                                    React.createElement(Row, null,
                                        React.createElement(Col, { sm: 3 },
                                            React.createElement(Nav, { variant: "pills", className: "flex-column" })),
                                        React.createElement(Col, { sm: 9 },
                                            React.createElement(Tab.Content, null)))))))))));
};
const Features = ({ summary }) => {
    return React.createElement("div", null,
        React.createElement(Table, { striped: true, bordered: true, hover: true },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "project"),
                    React.createElement("th", null, "platform"),
                    React.createElement("th", null, "BDD errors"),
                    React.createElement("th", null, "Lint errors"),
                    React.createElement("th", null, "Type errors"),
                    React.createElement("th", null, "prompt"))),
            React.createElement("tbody", null, ...summary.map((s) => {
                return React.createElement(React.Fragment, null,
                    React.createElement("tr", null,
                        React.createElement("th", null, s[0])),
                    ...s[1].tests.map((t) => {
                        const x = `${s[0]}/${t[0].split(".").slice(0, -1).join(".")}/${t[1]}`;
                        const y = s[2][t[0]];
                        return React.createElement("tr", null,
                            React.createElement("td", null, t[0]),
                            React.createElement("td", null, t[1]),
                            React.createElement("td", null,
                                React.createElement("a", { href: `./asdasasdasdd/reports/${x}/index.html` }, y.runTimeError)),
                            React.createElement("td", null,
                                React.createElement("a", { href: `./testeasdqqweqweranto/reports/${x}/lint_errors.json` }, y.staticErrors)),
                            React.createElement("td", null,
                                React.createElement("a", { href: `./testezxcdcdfranto/reports/${x}/type_errors.txt` }, y.typeErrors)),
                            React.createElement("td", null,
                                React.createElement("pre", null, s[2][t[0]].prompt)));
                    }));
            }))));
};
const Docs = ({ summary }) => {
    return React.createElement("div", null,
        React.createElement(Tab.Container, { id: "DocsPane-tabs", defaultActiveKey: "external" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement(Nav, null,
                        React.createElement(Nav.Link, { eventKey: `external` }, "external"),
                        React.createElement(Nav.Link, { eventKey: `markdown` }, "markdown"),
                        React.createElement(Nav.Link, { eventKey: `string` }, "string")))),
            React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement(Tab.Content, null,
                        React.createElement(Tab.Pane, { eventKey: `external` },
                            React.createElement(ExternalFeatures, { summary: summary })),
                        React.createElement(Tab.Pane, { eventKey: `markdown` },
                            React.createElement(ExternalFeatures, { summary: summary })),
                        React.createElement(Tab.Pane, { eventKey: `string` },
                            React.createElement(ExternalFeatures, { summary: summary })))))));
};
const BigBoard = () => {
    const bigConfigElement = document.getElementById('bigConfig');
    if (!bigConfigElement)
        throw new Error('bigConfig element not found');
    const projects = JSON.parse(bigConfigElement.innerHTML);
    const [summary, setSummary] = useState();
    useEffect(() => {
        (async () => {
            const x = projects.map(async (p) => {
                return [
                    p,
                    (await (await fetch(`./testeranto/reports/${p}/config.json`)).json()),
                    (await (await fetch(`./testeranto/reports/${p}/summary.json`)).json())
                ];
            });
            Promise.all(x).then((v) => {
                setSummary(v);
            });
        })();
    }, []);
    if (!summary || (summary === null || summary === void 0 ? void 0 : summary.length) === 0) {
        return React.createElement("div", null, "loading...");
    }
    // console.log("summary", summary)
    // // const collated: ICollations = configs.tests.map((c) => {
    // //   return {
    // //     ...bigBoard[c[0]],
    // //     name: c[0],
    // //     runTime: c[1],
    // //     tr: c[2],
    // //     sidecars: c[3],
    // //     staticAnalysis: bigBoard[c[0]].staticErrors,
    // //     typeErrors: bigBoard[c[0]].typeErrors,
    // //     bddErrors: bigBoard[c[0]].runTimeError,
    // //     prompt: bigBoard[c[0]].prompt
    // //   } as ICollation
    // // });
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
            console.log('Text copied to clipboard');
        })
            .catch(err => {
            console.error('Error copying text: ', err);
        });
    }
    return React.createElement("div", null,
        "    ",
        React.createElement(Tab.Container, { id: "TestPane-tabs", defaultActiveKey: "tests" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement(Nav, null,
                        React.createElement(Nav.Link, { eventKey: `tests` }, "tests"),
                        React.createElement(Nav.Link, { eventKey: `features` }, "features"),
                        React.createElement(Nav.Link, { eventKey: `docs` }, "docs")))),
            React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement(Tab.Content, null,
                        React.createElement(Tab.Pane, { eventKey: `tests` },
                            React.createElement(Table, { striped: true, bordered: true, hover: true },
                                React.createElement("thead", null,
                                    React.createElement("tr", null,
                                        React.createElement("th", null, "project"),
                                        React.createElement("th", null, "platform"),
                                        React.createElement("th", null, "BDD errors"),
                                        React.createElement("th", null, "Lint errors"),
                                        React.createElement("th", null, "Type errors"),
                                        React.createElement("th", null, "prompt"),
                                        React.createElement("th", null, "failing features"))),
                                React.createElement("tbody", null, ...summary.map((s) => {
                                    return React.createElement(React.Fragment, null,
                                        React.createElement("tr", null,
                                            React.createElement("th", null, s[0])),
                                        ...s[1].tests.map((t) => {
                                            const x = `${s[0]}/${t[0].split(".").slice(0, -1).join(".")}/${t[1]}`;
                                            const y = s[2][t[0]];
                                            return React.createElement("tr", null,
                                                React.createElement("td", null, t[0]),
                                                React.createElement("td", null, t[1]),
                                                React.createElement("td", null,
                                                    React.createElement("a", { href: `./testeranto/reports/${x}/index.html` }, y.runTimeError)),
                                                React.createElement("td", null,
                                                    React.createElement("a", { href: `./testeranto/reports/${x}/lint_errors.json` }, y.staticErrors)),
                                                React.createElement("td", null,
                                                    React.createElement("a", { href: `./testeranto/reports/${x}/type_errors.txt` }, y.typeErrors)),
                                                React.createElement("td", null,
                                                    React.createElement("pre", null,
                                                        React.createElement("button", { onClick: () => {
                                                                copyToClipboard(s[2][t[0]].prompt);
                                                            } }, "copy"))),
                                                React.createElement("td", null,
                                                    React.createElement("pre", null,
                                                        React.createElement("code", null, JSON.stringify(y.failingFeatures, null, 2)))));
                                        }));
                                })))),
                        React.createElement(Tab.Pane, { eventKey: `features` },
                            React.createElement(Features, { summary: summary })),
                        React.createElement(Tab.Pane, { eventKey: `docs` },
                            React.createElement(Docs, { summary: summary })))))),
        React.createElement(Footer, null));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}));
    }
});
