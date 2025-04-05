"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stream = exports.renderToStaticNodeStream = exports.renderToStaticMarkup = void 0;
const react_1 = require("react");
const server_1 = require("react-dom/server");
Object.defineProperty(exports, "renderToStaticMarkup", { enumerable: true, get: function () { return server_1.renderToStaticMarkup; } });
Object.defineProperty(exports, "renderToStaticNodeStream", { enumerable: true, get: function () { return server_1.renderToStaticNodeStream; } });
const stream_1 = __importDefault(require("stream"));
exports.Stream = stream_1.default;
const Node_js_1 = __importDefault(require("../../../Node.js"));
exports.default = (testImplementations, testSpecifications, testInput) => {
    return (0, Node_js_1.default)(testInput, testSpecifications, testImplementations, {
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve((0, react_1.createElement)(testInput));
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
