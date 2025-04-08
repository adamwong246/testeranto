import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
import { Footer } from "./Footer";
import { Table } from "react-bootstrap";
const BigBoard = () => {
    const projects = JSON.parse(document.getElementById('bigConfig').innerHTML);
    // const projects = Object.keys(bigConfig.projects);
    // const [configs, setConfigs] = useState<IBuiltConfig>();
    // useEffect(() => {
    //   (async () => {
    //     fetch('/kokomoBay/docs/testeranto.json')
    //       .then(response => response.json())
    //       .then(json => {
    //         setConfigs(json)
    //       })
    //       .catch(error => console.error(error));
    //   })();
    // }, []);
    // const [bigBoard, setBigBoard] = useState<Record<string, ISummary>>({});
    // useEffect(() => {
    //   (async () => {
    //     fetch('/kokomoBay/docs/summary.json')
    //       .then(response => response.json())
    //       .then(json => {
    //         setBigBoard(json)
    //       })
    //       .catch(error => console.error(error));
    //   })();
    // }, []);
    const [summary, setSummary] = useState();
    useEffect(() => {
        (async () => {
            const x = projects.map(async (p) => {
                return [
                    p,
                    (await (await fetch(`/kokomoBay/testeranto/reports/${p}/config.json`)).json()),
                    (await (await fetch(`/kokomoBay/testeranto/reports/${p}/summary.json`)).json())
                ];
            });
            Promise.all(x).then((v) => {
                setSummary(v);
            });
            // fetch('/kokomoBay/docs/summary.json')
            //   .then(response => response.json())
            //   .then(json => {
            //     setBigBoard(json)
            //   })
            //   .catch(error => console.error(error));
        })();
    }, []);
    if (!summary || (summary === null || summary === void 0 ? void 0 : summary.length) === 0) {
        return React.createElement("div", null, "loading...");
    }
    console.log("summary", summary);
    // const collated: ICollations = configs.tests.map((c) => {
    //   return {
    //     ...bigBoard[c[0]],
    //     name: c[0],
    //     runTime: c[1],
    //     tr: c[2],
    //     sidecars: c[3],
    //     staticAnalysis: bigBoard[c[0]].staticErrors,
    //     typeErrors: bigBoard[c[0]].typeErrors,
    //     bddErrors: bigBoard[c[0]].runTimeError,
    //     prompt: bigBoard[c[0]].prompt
    //   } as ICollation
    // });
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
                                React.createElement("a", { href: `/kokomoBay/testeranto/reports/${x}/littleBoard.html` }, y.runTimeError)),
                            React.createElement("td", null,
                                React.createElement("a", { href: `/kokomoBay/testeranto/reports/${x}/lint_errors.json` }, y.staticErrors)),
                            React.createElement("td", null,
                                React.createElement("a", { href: `/kokomoBay/testeranto/reports/${x}/type_errors.txt` }, y.typeErrors)),
                            React.createElement("td", null,
                                React.createElement("pre", null, s[2][t[0]].prompt)));
                    }));
            }))),
        React.createElement(Footer, null));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}, []));
    }
});
console.log("hello BigBoard!");
