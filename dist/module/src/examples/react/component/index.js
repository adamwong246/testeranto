import React from "react";
export class ClassicalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }
    render() {
        return (React.createElement("div", { style: { border: "3px solid black" } },
            React.createElement("h1", { id: "theHeader" }, "Hello Marcus"),
            React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)),
            React.createElement("p", null,
                "foo: ",
                this.props.foo),
            React.createElement("pre", { id: "theStat" }, JSON.stringify(this.state)),
            React.createElement("p", null,
                "count: ",
                this.state.count,
                " times"),
            React.createElement("button", { id: "theButton", onClick: async () => {
                    this.setState({ count: this.state.count + 1 });
                } }, "Click")));
    }
}
export default ClassicalComponent;
