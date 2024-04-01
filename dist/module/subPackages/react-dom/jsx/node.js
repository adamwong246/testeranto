import { createElement } from "react";
import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream';
import Testeranto from "../../../Node";
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, {
        // beforeAll: async (
        //   prototype,
        //   artificer
        // ): Promise<ISubject> => {
        //   return await new Promise((resolve, rej) => {
        //     const elem = document.getElementById("root");
        //     if (elem) {
        //       resolve({ htmlElement: elem });
        //     }
        //   })
        // },
        beforeEach: async (reactComponent, ndx, testRsource, artificer) => {
            return new Promise((resolve, rej) => {
                // Ignore these type errors
                resolve(createElement(testInput));
            });
        },
        andWhen: async function (s, actioner) {
            // return actioner()(s);
            return s;
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
//       andWhen: function (s: IStore, actioner): Promise<ISelection> {
//         throw new Error(`"andWhens" are not permitted`);
//       }
//     },
//   )
// };
