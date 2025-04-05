import { createElement } from "react";
import { renderToStaticMarkup, renderToStaticNodeStream, } from "react-dom/server";
import Stream from "stream";
import Testeranto from "../../../Node.js";
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, {
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve(createElement(testInput));
            });
        },
        andWhen: async function (s, whenCB) {
            return whenCB(s);
        },
        butThen: async function (s) {
            return s;
        },
        afterEach: async function () {
            return {};
        },
        afterAll: () => {
            return;
        },
    });
};
// type IInput = typeof React.Component;
// type InitialState = unknown;
// type IWhenShape = any;
// type IThenShape = any;
// type ISelection = string;
// type IStore = string;
// type ISubject = string
// export default <ITestShape extends ITTestShape>(
//   testImplementations: ITestImplementation<
//     InitialState,
//     ISelection,
//     IWhenShape,
//     IThenShape,
//     ITestShape
//   >,
//   testSpecifications: ITestSpecification<
//     ITestShape,
//     ISubject,
//     IStore,
//     ISelection,
//     IThenShape
//   >,
//   testInput: IInput
// ) => {
//   return Testeranto<
//     ITestShape,
//     IInput,
//     ISubject,
//     IStore,
//     ISelection,
//     IThenShape,
//     IWhenShape,
//     InitialState
//   >(
//     testInput,
//     testSpecifications,
//     testImplementations,
//     {
//       beforeEach: async (
//         element,
//         ndx,
//         testResource,
//         artificer
//       ): Promise<IStore> => {
//         return new Promise((resolve, rej) => {
//           resolve(ReactDOMServer.renderToStaticMarkup(element));
//         });
//       },
//       andWhen: function (s: IStore, whenCB): Promise<ISelection> {
//         throw new Error(`"andWhens" are not permitted`);
//       }
//     },
//   )
// };
