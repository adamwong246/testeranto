var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ReactDom from "react-dom/client";
import React from 'react';
import storefront from "../../../src/storefront";
let rroot;
let elem;
class TestHarness extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: -99
        };
        /* @ts-ignore:next-line */
        document.addEventListener("setCounterEvent", (e) => {
            this.setState({ counter: e.detail });
        });
    }
    render() {
        return (<div>
        {storefront({
                counter: this.state.counter,
                /* @ts-ignore:next-line */
                inc: () => window.AppInc('true'),
                /* @ts-ignore:next-line */
                dec: () => window.AppDec('true'),
            })}
      </div>);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    return __awaiter(this, void 0, void 0, function* () {
        elem = document.getElementById("root");
        if (elem) {
            rroot = ReactDom.createRoot(elem);
            rroot.render(<TestHarness />);
            /* @ts-ignore:next-line */
            window.AppBooted('true');
        }
    });
});
