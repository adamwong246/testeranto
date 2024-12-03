import { createElement } from "react";
import ReactDom from "react-dom/client";
import Testeranto from "../../../Web.js";
export default (testInput, testSpecifications, testImplementations) => {
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
    const t = Testeranto(testInput, testSpecifications, testImplementations, {
        beforeAll: async (initialProps, artificer) => {
            console.log("mark5", initialProps);
            return await new Promise((resolve, rej) => {
                const htmlElement = document.getElementById("root");
                if (htmlElement) {
                    const domRoot = ReactDom.createRoot(htmlElement);
                    // Ignore these type errors
                    domRoot.render(createElement(TesterantoComponent, Object.assign(Object.assign({}, initialProps), { done: (reactElement) => {
                            resolve({
                                htmlElement,
                                reactElement,
                                domRoot,
                            });
                        } }), []));
                    // resolve({ htmlElement });
                }
            });
        },
        // beforeEach: async (
        //   s,
        //   initializer,
        //   testResource,
        //   artificer,
        //   initialValues
        // ): Promise<IStore> => {
        //   return new Promise((resolve, rej) => {
        //     console.log("beforeEach" + TesterantoComponent);
        //     // const domRoot = ReactDom.createRoot(htmlElement);
        //     // // Ignore these type errors
        //     // domRoot.render(
        //     //   createElement(
        //     //     TesterantoComponent,
        //     //     {
        //     //       ...initializer,
        //     //       done: (reactElement) => {
        //     //         resolve({
        //     //           htmlElement,
        //     //           reactElement,
        //     //           domRoot,
        //     //         });
        //     //       },
        //     //     },
        //     //     []
        //     //   )
        //     // );
        //   });
        // },
        andWhen: function (s, whenCB) {
            return whenCB(s);
        },
        butThen: async function (s, thenCB) {
            return thenCB(s);
        },
        afterEach: async function (store, ndx, artificer, utils) {
            console.log("afterEach", store);
            utils.writeFileSync("aftereachlog", store.toString());
            const page = (await utils.browser.pages()).filter((x) => {
                const parsedUrl = new URL(x.url());
                parsedUrl.search = "";
                const strippedUrl = parsedUrl.toString();
                return (strippedUrl ===
                    "file:///Users/adam/Code/kokomoBay/docs/web/src/ClassicalComponent/react-dom/client.web.test.html");
                // return true;
            })[0];
            await page.screenshot({
                path: "afterEachLog.jpg",
            });
            // debugger;
            // const div_root = document.getElementById("root");
            // store.domRoot && store.domRoot.unmount(); //React 18
            //  store.remove();
            // store.htmlElement.remove();
            // store.htmlElement = document.createElement("root");
            return store;
        },
        afterAll: async (store, artificer, utils) => {
            // setTimeout(() => {
            //   console.log("This will run after 1 second");
            // }, 1000); // 1000 milliseconds = 1 second
            // store.htmlElement.remove();
            // store.htmlElement = document.createElement("root");
            return store;
        },
    });
    document.addEventListener("DOMContentLoaded", function () {
        const elem = document.getElementById("root");
        if (elem) {
            return t;
        }
    });
    return t;
};
