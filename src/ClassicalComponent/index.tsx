import React from "react";

export type IProps = any;  //{ foo: string };
export type IState = { count: number };

export class ClassicalComponent extends React.Component<IProps, IState> {
  constructor(props) {

    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div style={{ border: '3px solid black' }}>
        <h1 id="theHeader">Hello Marcus</h1>
        <pre id="theProps">{JSON.stringify(this.props)}</pre>
        <p>foo: {this.props.foo}</p>
        <pre id="theStat">{JSON.stringify(this.state)}</pre>
        <p>count: {this.state.count} times</p>
        <button id="theButton" onClick={async () => {
          this.setState({ count: this.state.count + 1 })
        }}>
          Click
        </button>
      </div>
    );
  }
}
