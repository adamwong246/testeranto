import { createElement } from "react";
import ReactDom from "react-dom/client";
import Testeranto from "../../../Web";
export default (testInput, testSpecifications, testImplementations) => {
    console.log("mark80" + testImplementations);
    document.addEventListener("DOMContentLoaded", function () {
        console.log("DOMContentLoaded");
        const elem = document.getElementById("root");
        if (elem) {
            class TesterantoComponent extends testInput {
                constructor(props) {
                    super(props);
                    this.done = props.done;
                }
                componentDidMount() {
                    super.componentDidMount && super.componentDidMount();
                    return this.done(this);
                }
            }
            return Testeranto(testInput, testSpecifications, testImplementations, {
                beforeAll: async (initialProps, artificer) => {
                    // console.log("mark41", initialProps)
                    return await new Promise((resolve, rej) => {
                        const elem = document.getElementById("root");
                        if (elem) {
                            resolve({ htmlElement: elem });
                        }
                    });
                },
                beforeEach: async ({ htmlElement }, initialValues, testResource, artificer) => {
                    console.log("mark444", initialValues);
                    // debugger
                    return new Promise((resolve, rej) => {
                        // Ignore these type errors
                        ReactDom.createRoot(htmlElement).render(createElement(TesterantoComponent, Object.assign(Object.assign({}, initialValues.props), { done: (reactElement) => {
                                resolve({
                                    htmlElement,
                                    reactElement,
                                });
                            } }), []));
                    });
                },
                andWhen: function (s, whenCB) {
                    console.log("mark31", whenCB);
                    return whenCB(s);
                },
                butThen: async function (s) {
                    return s;
                },
                afterEach: async function (store, ndx, artificer) {
                    return {};
                },
                afterAll: (store, artificer) => {
                    return;
                },
            });
        }
    });
};
