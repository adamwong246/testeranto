import ReactDom from "react-dom/client";
import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { Footer } from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TestReport.scss";
const BddPage = () => {
    // const [configs, setConfigs] = useState<IBuiltConfig>();
    // useEffect(() => {
    //   (async () => {
    //     fetch('../config.json')
    //       .then(response => response.json())
    //       .then(json => {
    //         setConfigs(json)
    //       })
    //       .catch(error => console.error(error));
    //   })();
    // }, []);
    const [bddErrors, setBddErrors] = useState();
    useEffect(() => {
        (async () => {
            try {
                const fetched = await fetch(`${window.location.href
                    .split("/")
                    .slice(0, -1)
                    .join("/")}/tests.json`);
                const testsJson = await (fetched).json();
                setBddErrors(testsJson);
            }
            catch (e) {
                setBddErrors({ error: e });
            }
        })();
    }, []);
    const [log, setLog] = useState();
    const [message, setMessage] = useState();
    const [prompt, setPrompt] = useState();
    useEffect(() => {
        (async () => {
            try {
                setLog(await (await fetch(`${window.location.href.split("/").slice(0, -1).join("/")}/logs.txt`)).text());
            }
            catch (e) {
                setLog({ error: e });
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const messageText = await (await fetch(`${window.location.href.split("/").slice(0, -1).join("/")}/message.txt`)).text();
                setMessage(messageText);
                console.log('Message:', messageText);
            }
            catch (e) {
                setMessage({ error: e });
                console.error('Error loading message:', e);
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const promptText = await (await fetch(`${window.location.href.split("/").slice(0, -1).join("/")}/prompt.txt`)).text();
                setPrompt(promptText);
                console.log('Prompt:', promptText);
            }
            catch (e) {
                setPrompt({ error: e });
                console.error('Error loading prompt:', e);
            }
        })();
    }, []);
    // })();
    //   }, []);
    if (bddErrors === undefined || log === undefined) {
        return React.createElement("div", null, "loading...");
    }
    const copyAiderCommand = async () => {
        if (typeof prompt !== 'string' || typeof message !== 'string') {
            alert('Prompt and message files must be loaded first');
            return;
        }
        const basePath = window.location.href.split('/').slice(0, -1).join('/');
        const command = `aider --log-file ${basePath}/message.txt --message-file ${basePath}/prompt.txt`;
        try {
            await navigator.clipboard.writeText(command);
            alert('Copied to clipboard:\n' + command);
        }
        catch (err) {
            alert('Failed to copy command: ' + err);
        }
    };
    const basePath = window.location.href.split('/').slice(0, -1).join('/');
    return (React.createElement("div", { className: "container-fluid p-4" },
        React.createElement("nav", { className: "navbar navbar-expand-lg navbar-light bg-light mb-3 rounded" },
            React.createElement("div", { className: "container-fluid" },
                React.createElement("span", { className: "navbar-brand text-muted" }, basePath.split("testeranto/reports")[1]),
                React.createElement("div", { className: "ms-auto" },
                    React.createElement("button", { onClick: copyAiderCommand, className: "btn btn-primary", title: "Copy aider command to clipboard" }, "\uD83E\uDD16\uD83E\uDE84\u2728")))),
        React.createElement(Tab.Container, { defaultActiveKey: "tests" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 2 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "tests" }, "Results")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "logs" }, "Logs")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "ai" }, "Aider")))),
                React.createElement(Col, { sm: 10 },
                    React.createElement(Tab.Content, null,
                        React.createElement(Tab.Pane, { eventKey: "tests" }, 'error' in bddErrors ? (React.createElement("div", { className: "alert alert-danger" },
                            React.createElement("h4", null, "Error loading test results"),
                            React.createElement("pre", null, JSON.stringify(bddErrors.error, null, 2)))) : (React.createElement("div", null,
                            React.createElement("h2", null, "Test Results"),
                            bddErrors.name && React.createElement("h3", null, bddErrors.name),
                            bddErrors.givens.map((given, i) => (React.createElement("div", { key: i, className: "mb-4" },
                                React.createElement("h4", null,
                                    "Given: ",
                                    given.name),
                                React.createElement("ul", { className: "list-group" }, given.whens.map((when, j) => (React.createElement("li", { key: `w-${j}`, className: `list-group-item ${when.error ? 'list-group-item-danger' : 'list-group-item-success'}` },
                                    React.createElement("strong", null, "When:"),
                                    " ",
                                    when.name,
                                    when.error && (React.createElement("div", { className: "mt-2" },
                                        React.createElement("pre", { className: "text-danger" }, when.error))))))),
                                React.createElement("ul", { className: "list-group mt-2" }, given.thens.map((then, k) => (React.createElement("li", { key: `t-${k}`, className: `list-group-item ${then.error ? 'list-group-item-danger' : 'list-group-item-success'}` },
                                    React.createElement("strong", null, "Then:"),
                                    " ",
                                    then.name,
                                    then.error && (React.createElement("div", { className: "mt-2" },
                                        React.createElement("pre", { className: "text-danger" }, then.error))))))))))))),
                        React.createElement(Tab.Pane, { eventKey: "logs" }, typeof log === 'string' ? (React.createElement("div", null,
                            React.createElement("pre", { className: "bg-secondary text-white p-3", style: { overflow: 'auto' } }, log))) : (React.createElement("div", { className: "alert alert-danger" },
                            React.createElement("h4", null, "Error loading logs"),
                            React.createElement("pre", null, JSON.stringify(log.error, null, 2))))),
                        React.createElement(Tab.Pane, { eventKey: "ai" },
                            React.createElement("div", { className: "row" },
                                React.createElement("div", { className: "col-md-12" },
                                    typeof message === 'string' ? (React.createElement("pre", { className: "bg-secondary text-white p-3", style: { overflow: 'auto' } }, message)) : (React.createElement("div", { className: "alert alert-danger" },
                                        React.createElement("h5", null, "Error loading AI message"),
                                        React.createElement("pre", null, JSON.stringify(message.error, null, 2)))),
                                    typeof prompt === 'string' ? (React.createElement("pre", { className: "bg-secondary text-white  p-3", style: { overflow: 'auto' } }, prompt)) : (React.createElement("div", { className: "alert alert-danger" },
                                        React.createElement("h5", null, "Error loading AI prompt"),
                                        React.createElement("pre", null, JSON.stringify(prompt.error, null, 2))))))))))),
        React.createElement(Footer, null)));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        if (elem) {
            const root = ReactDom.createRoot(elem);
            root.render(React.createElement(BddPage, {}));
        }
    }
});
