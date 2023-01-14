import ReactDom from "react-dom/client";
import React, { useState } from 'react';

import storefront from "../src/storefront";

let rroot;
let elem;

class TestHarness extends React.Component<any, { counter: number }> {
  constructor(props) {
    super(props);
    this.state = {
      counter: -99
    };

    /* @ts-ignore:next-line */
    document.addEventListener("setCounterEvent", (e: CustomEvent<number>) => {
      this.setState({ counter: e.detail })
    });

  }

  render() {
    return (
      <div>


        {
          storefront(
            {
              counter: this.state.counter,

              /* @ts-ignore:next-line */
              inc: () => window.AppInc('true'),

              /* @ts-ignore:next-line */
              dec: () => window.AppDec('true'),
            }
          )

        }
      </div>
    );
  }
}


const tHarness = new TestHarness({});


document.addEventListener("DOMContentLoaded", async function () {

  console.log("\tDOMContentLoaded!")
  elem = document.getElementById("root");

  if (elem) {
    rroot = ReactDom.createRoot(elem);
    rroot.render(<TestHarness />);
    /* @ts-ignore:next-line */
    window.AppBooted('true');
  }

});

