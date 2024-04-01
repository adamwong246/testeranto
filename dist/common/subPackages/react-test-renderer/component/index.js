"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterface = void 0;
const react_test_renderer_1 = __importStar(require("react-test-renderer"));
// export const testInterface = {
//   beforeEach: function (CComponent, props): Promise<renderer.ReactTestRenderer> {
//     return new Promise((res, rej) => {
//       let component: renderer.ReactTestRenderer;
//       act(() => {
//         component = renderer.create(
//           CComponent(props)
//         );
//         res(component);
//       });
//     });
//   },
//   andWhen: async function (
//     renderer: renderer.ReactTestRenderer,
//     actioner: () => (any) => any
//   ): Promise<renderer.ReactTestRenderer> {
//     await act(() => actioner()(renderer));
//     return renderer
//   }
// }
exports.testInterface = {
    beforeEach: function (CComponent, props) {
        return new Promise((res, rej) => {
            (0, react_test_renderer_1.act)(() => {
                const x = react_test_renderer_1.default.create(new CComponent(props));
                console.log("beforeEach", x.getInstance());
                res(x);
            });
        });
    },
    andWhen: async function (renderer, actioner) {
        // console.log("andWhen", renderer)
        await (0, react_test_renderer_1.act)(() => actioner()(renderer));
        return renderer;
    },
    // andWhen: function (s: Store, actioner): Promise<Selection> {
    //   return actioner()(s);
    // },
    butThen: async function (s) {
        // console.log("butThen", s)
        return s;
    },
    afterEach: async function (store, ndx, artificer) {
        // console.log("afterEach", store);
        return {};
    },
    afterAll: (store, artificer) => {
        // console.log("afterAll", store);
        return;
    },
};
