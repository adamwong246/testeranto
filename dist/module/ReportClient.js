import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
const BigBoard = () => {
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
    const [bigBoard, setBigBoard] = useState({});
    useEffect(() => {
        (async () => {
            fetch('http://localhost:8080/bigBoard.json')
                .then(response => response.json())
                .then(json => {
                setBigBoard(json);
            })
                .catch(error => console.error(error));
        })();
    }, []);
    const [staticAnalysis, setStaticAnalysis] = useState({});
    useEffect(() => {
        (async () => {
            let accumulator = {};
            for (const t of (configs || { tests: [] }).tests) {
                accumulator[t[0]] = await (await fetch(`http://localhost:8080/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/lint_errors.exitCode`)).text();
            }
            setStaticAnalysis(accumulator);
        })();
    }, [configs, bigBoard]);
    const [typeErrors, setTypeErrors] = useState({});
    useEffect(() => {
        (async () => {
            let accumulator = {};
            for (const t of (configs || { tests: [] }).tests) {
                accumulator[t[0]] = await (await fetch(`http://localhost:8080/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/type_errors.exitCode`)).text();
            }
            setTypeErrors(accumulator);
        })();
    }, [configs, bigBoard]);
    const [bddErrors, setBddErrors] = useState({});
    useEffect(() => {
        (async () => {
            let accumulator = {};
            for (const t of (configs || { tests: [] }).tests) {
                accumulator[t[0]] = await (await fetch(`http://localhost:8080/${t[1]}/${t[0].split(".").slice(0, -1).join(".")}/exitCode`)).text();
            }
            setBddErrors(accumulator);
        })();
    }, [configs, bigBoard]);
    if (!configs || !staticAnalysis || !typeErrors || !bddErrors) {
        return React.createElement("div", null, "loading...");
    }
    const collated = configs.tests.map((c) => {
        return Object.assign(Object.assign({}, bigBoard[c[0]]), { name: c[0], runTime: c[1], tr: c[2], sidecars: c[3], staticAnalysis: staticAnalysis[c[0]], typeErrors: typeErrors[c[0]], bddErrors: bddErrors[c[0]] });
    });
    return React.createElement("table", null,
        React.createElement("tr", null,
            React.createElement("td", null, "name"),
            React.createElement("td", null, "run time"),
            React.createElement("td", null, "BDD errors"),
            React.createElement("td", null, "Lint errors"),
            React.createElement("td", null, "Type errors"),
            React.createElement("td", null, "prompt")),
        ...collated.map((c) => {
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
                    React.createElement("pre", null,
                        "aider --model deepseek/deepseek-chat --load ",
                        `docs/${c.runTime}/${c.name.split(".").slice(0, -1).join(".")}/prompt.txt`)));
        }));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(BigBoard, {}, []));
    }
});
console.log("hello BigBoard!");
