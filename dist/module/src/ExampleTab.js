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
console.log("urlParams", urlParams.has("local"));
// Get the value of a specific parameter
const isLocal = urlParams.get("local");
const urlFixer = (url) => {
    if (isLocal) {
        return `file:///Users/adam/Code/kokomoBay/${url}`;
    }
    else {
        return `https://chromapdx.github.io/kokomoBay/${url}`;
    }
};
const TextTab = (props) => {
    const [text, setText] = useState('');
    useEffect(() => {
        fetch(props.url) // Replace with your API endpoint
            .then(response => response.text())
            .then(data => setText(data))
            .catch(error => console.error('Error fetching text:', error));
    }, []);
    return React.createElement("code", null,
        React.createElement("pre", null, text));
};
export default () => {
    return (React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "examples-0" },
        React.createElement(Row, null,
            React.createElement(Col, { sm: 3, lg: 2 },
                React.createElement(Nav, { variant: "pills", className: "flex-column" },
                    React.createElement(Nav.Link, { eventKey: `manual-example-rectangle` }, "RECTANGLE"),
                    React.createElement(Nav.Link, { eventKey: `manual-example-ClassicalComponent` }, "ClassicalComponent"),
                    React.createElement(Nav.Link, { eventKey: `manual-example-react+sol` }, "React and solidity"))),
            React.createElement(Col, { sm: 3, lg: 2 },
                React.createElement(Tab.Content, null,
                    React.createElement(Tab.Pane, { eventKey: `manual-example-rectangle`, key: `manual-example-rectangle` },
                        React.createElement("pre", null, "In this contrived example, we are testing the Rectangle class. Node that because it uses no web-specific, nor node-specific language features, it can be run in either runtime, thought it more efficient and reasonable to test in node.")),
                    React.createElement(Tab.Pane, { eventKey: `manual-example-ClassicalComponent`, key: `manual-example-ClassicalComponent` },
                        React.createElement("pre", null, "Testing a react component with the react-test-renderer package.")),
                    React.createElement(Tab.Pane, { eventKey: `manual-example-react+sol`, key: `manual-example-react+sol` },
                        React.createElement("pre", null, "Testing a react component which is backed by a solidity contract. This test is performed _on_ the server but but _through_ the browser. The react element is renderer into an chromium window and accessed by puppeteer.")))),
            React.createElement(Col, null,
                React.createElement(Tab.Content, null,
                    React.createElement(Tab.Pane, { eventKey: `manual-example-rectangle`, key: `manual-example-rectangle` },
                        React.createElement(Tabs, { defaultActiveKey: "profile", id: "uncontrolled-tab-example", className: "mb-3" },
                            React.createElement(Tab, { eventKey: "Rectangle.ts", title: "Rectangle.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/Rectangle.ts") })),
                            React.createElement(Tab, { eventKey: "Rectangle.test.specification.ts", title: "Rectangle.test.specification.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/Rectangle.test.specification.ts") })),
                            React.createElement(Tab, { eventKey: "Rectangle.test.shape.ts", title: "Rectangle.test.shape.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/Rectangle.test.shape.ts") })),
                            React.createElement(Tab, { eventKey: "Rectangle.test.implementation.ts", title: "Rectangle.test.implementation.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/Rectangle.test.implementation.ts") })),
                            React.createElement(Tab, { eventKey: "Rectangle.test.interface.ts", title: "Rectangle.test.interface.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/Rectangle.test.interface.ts") })),
                            React.createElement(Tab, { eventKey: "Rectangle.config", title: "Rectangle.config" },
                                React.createElement("code", null,
                                    React.createElement("pre", null, `
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
              `))))),
                    React.createElement(Tab.Pane, { eventKey: `manual-example-ClassicalComponent`, key: `manual-example-ClassicalComponent` },
                        React.createElement(Tabs, { defaultActiveKey: "profile", id: "uncontrolled-tab-example", className: "mb-3" },
                            React.createElement(Tab, { eventKey: "ClassicalComponent/index.tsx", title: "ClassicalComponent/index.tsx" },
                                React.createElement(TextTab, { url: urlFixer("src/ClassicalComponent/index.tsx") })),
                            React.createElement(Tab, { eventKey: "ClassicalComponent/test.specification.ts", title: "ClassicalComponent/test.specification.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/ClassicalComponent/test.specification.ts") })),
                            React.createElement(Tab, { eventKey: "ClassicalComponent/test.shape.ts", title: "ClassicalComponent/test.shape.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/ClassicalComponent/test.shape.ts") })),
                            React.createElement(Tab, { eventKey: "ClassicalComponent/react-test-renderer/test.implementation.ts", title: "ClassicalComponent/react-test-renderer/test.implementation.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/ClassicalComponent/react-test-renderer/test.implementation.ts") })),
                            React.createElement(Tab, { eventKey: "react-test-renderer/test.interface.ts", title: "react-test-renderer/test.interface.ts" },
                                React.createElement(TextTab, { url: "https://raw.githubusercontent.com/adamwong246/testeranto/master/src/subPackages/react-test-renderer/component/interface.ts" })))),
                    React.createElement(Tab.Pane, { eventKey: `manual-example-react+sol`, key: `manual-example-react+sol` },
                        React.createElement(Tabs, { defaultActiveKey: "profile", id: "uncontrolled-tab-example", className: "mb-3" },
                            React.createElement(Tab, { eventKey: "contracts/MyBaseContract.sol", title: "MyBaseContract.sol" },
                                React.createElement(TextTab, { url: urlFixer("contracts/MyBaseContract.sol") })),
                            React.createElement(Tab, { eventKey: "src/MyFirstContractUI.tsx", title: "MyFirstContractUI.tsx" },
                                React.createElement(TextTab, { url: urlFixer("src/MyFirstContractUI.tsx") })),
                            React.createElement(Tab, { eventKey: "src/MyFirstContract.specification.test.ts", title: "MyFirstContract.specification.test.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/MyFirstContract.specification.test.ts") })),
                            React.createElement(Tab, { eventKey: "src/MyFirstContract.solidity-react.interface.test.ts", title: "MyFirstContract.solidity-react.interface.test.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/MyFirstContract.solidity-react.interface.test.ts") })),
                            React.createElement(Tab, { eventKey: "src/MyFirstContract.solidity-react.implementation.test.ts", title: "MyFirstContract.solidity-react.implementation.test.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/MyFirstContract.solidity-react.implementation.test.ts") })),
                            React.createElement(Tab, { eventKey: "src/MyFirstContract.solidity-react.shape.test.ts", title: "MyFirstContract.solidity-react.shape.test.ts" },
                                React.createElement(TextTab, { url: urlFixer("src/MyFirstContract.solidity-react.shape.test.ts") })),
                            React.createElement(Tab, { eventKey: "MyFirstContract.solidity-react-example-jpg", title: "screenshot" },
                                React.createElement("img", { src: urlFixer("docs/node/src/MyFirstContract.solidity-react.testeranto/suite-0/given-test1/when/0/afterEach/andWhen.jpg") })))))))));
};
