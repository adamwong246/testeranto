import { createElement } from "react";
import ReactDom from "react-dom/client";
import Testeranto from "../../../Web";
export default (testInput, testSpecifications, testImplementations) => {
    document.addEventListener("DOMContentLoaded", function () {
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
                    return await new Promise((resolve, rej) => {
                        const elem = document.getElementById("root");
                        if (elem) {
                            resolve({ htmlElement: elem });
                        }
                    });
                },
                beforeEach: async ({ htmlElement }, initialValues, testResource, artificer) => {
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
