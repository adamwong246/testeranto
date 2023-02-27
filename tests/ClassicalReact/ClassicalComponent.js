import React from "react";
export class ClassicalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }
    render() {
        return (<div style={{ border: '3px solid green' }}>
        <h1>Hello Classical React</h1>
        <pre id="theProps">{JSON.stringify(this.props)}</pre>
        <p>foo: {this.props.foo}</p>
        <pre id="theState">{JSON.stringify(this.state)}</pre>
        <p>count: {this.state.count} times</p>
        <button id="theButton" onClick={() => {
                this.setState({ count: this.state.count + 1 });
            }}>
          Click
        </button>
      </div>);
    }
}
