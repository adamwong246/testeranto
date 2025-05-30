import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
import { Footer } from "./Footer";
import { Table } from "react-bootstrap";
const BigBoard = () => {
    const [configs, setConfigs] = useState();
    useEffect(() => {
        (async () => {
            fetch(`./reports/${window.location.pathname.split('/').pop()}/config.json`)
                .then(response => response.json())
                .then(json => {
                setConfigs(json);
            })
                .catch(error => console.error(error));
        })();
    }, []);
    const [bigBoard, setBigBoard] = useState({});
    useEffect(() => {
        (async () => {
            fetch('./docs/summary.json')
                .then(response => response.json())
                .then(json => {
                setBigBoard(json);
            })
                .catch(error => console.error(error));
        })();
    }, []);
    // const [staticAnalysis, setStaticAnalysis] = useState<Record<string, string>>({});
    // useEffect(() => {
    //   (async () => {
    //     let accumulator = {};
    //     for (const t of (configs || { tests: [] as ITestTypes[] }).tests) {
    //       accumulator[t[0]] = await (await fetch(`/kokomoBay/docs/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/lint_errors.txt`)).text()
    //     }
    //     setStaticAnalysis(accumulator);
    //   })();
    // }, [configs, bigBoard]);
    // const [typeErrors, setTypeErrors] = useState<Record<string, string>>({});
    // useEffect(() => {
    //   (async () => {
    //     let accumulator = {};
    //     for (const t of (configs || { tests: [] as ITestTypes[] }).tests) {
    //       accumulator[t[0]] = await (await fetch(`/kokomoBay/docs/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/type_errors.txt`)).text()
    //     }
    //     setTypeErrors(accumulator);
    //   })();
    // }, [configs, bigBoard]);
    // const [bddErrors, setBddErrors] = useState<Record<string, string>>({});
    // useEffect(() => {
    //   (async () => {
    //     let accumulator = {};
    //     for (const t of (configs || { tests: [] as ITestTypes[] }).tests) {
    //       accumulator[t[0]] = await (await fetch(`/kokomoBay/docs/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/bdd_errors.txt`)).text()
    //     }
    //     setBddErrors(accumulator);
    //   })();
    // }, [configs, bigBoard]);
    if (!configs) {
        return React.createElement("div", null, "loading...");
    }
    const collated = configs.tests.map((c) => {
        return Object.assign(Object.assign({}, bigBoard[c[0]]), { name: c[0], runTime: c[1], tr: c[2], sidecars: c[3], staticAnalysis: bigBoard[c[0]].staticErrors, typeErrors: bigBoard[c[0]].typeErrors, bddErrors: bigBoard[c[0]].runTimeError, prompt: bigBoard[c[0]].prompt });
    });
    return React.createElement("div", null,
        React.createElement(Table, { striped: true, bordered: true, hover: true },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null),
                    React.createElement("th", null, "platform"),
                    React.createElement("th", null, "BDD errors"),
                    React.createElement("th", null, "Lint errors"),
                    React.createElement("th", null, "Type errors"),
                    React.createElement("th", null, "prompt"))),
            React.createElement("tbody", null, ...collated.map((c) => {
                return React.createElement("tr", null,
                    React.createElement("td", null, c.name),
                    React.createElement("td", null, c.runTime),
                    React.createElement("td", null,
                        React.createElement("a", { href: `${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/littleBoard.html` }, c.bddErrors)),
                    React.createElement("td", null,
                        React.createElement("a", { href: `${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/lint_errors.json` }, c.staticAnalysis)),
                    React.createElement("td", null,
                        React.createElement("a", { href: `${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/type_errors.txt` }, c.typeErrors)),
                    React.createElement("td", null,
                        React.createElement("pre", null, c.prompt)));
            }))),
        React.createElement(Footer, null));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}, []));
    }
});
console.log("hello ReportClient!");
