import React, { useEffect } from "react";

export type IProps = { foo?: string };
export type IState = { count: number };

export class ClassicalComponent extends React.Component<IProps, IState> {
  constructor(props) {
    console.log("hello ClassicalComponent")

    super(props);
    this.state = {
      count: 0
    };
  }


  componentDidMount() {
    console.info("componentDidMount");
    // const x = fetch("http://www.google.com")
    //   .then((response) => response.text())
    //   .then(x => {
    //     console.warn("i am a genius", x)
    //   });

    // console.info("x", x);

    const y = fetch("http://www.google.com/", { mode: `no-cors` })
      // .then((response) => response.text())
      .then(x => {
        console.log("i am a genius!")
      });

    // console.info(y);

  }
  render() {
    return (
      <div style={{ border: '3px solid green' }}>
        <h1>Hello Classical React</h1>
        <pre id="theProps">{JSON.stringify(this.props)}</pre>
        <p>foo: {this.props.foo}</p>
        <pre id="theState">{JSON.stringify(this.state)}</pre>
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

export type IClassicalComponent = ClassicalComponent;