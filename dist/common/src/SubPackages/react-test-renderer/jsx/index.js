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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterface = void 0;
const react_1 = __importDefault(require("react"));
const react_test_renderer_1 = __importStar(require("react-test-renderer"));
exports.testInterface = {
    butThen: async function (s, thenCB) {
        // console.log("butThen", thenCB.toString());
        return thenCB(s);
    },
    beforeEach: function (CComponent, props) {
        let component;
        (0, react_test_renderer_1.act)(() => {
            // component = renderer.create(
            //   React.createElement(
            //     AppContext.Provider,
            //     { value: contextValue },
            //     React.createElement(AppContext.Consumer, null, (context) =>
            //       React.createElement(CComponent, Object.assign({}, context, {}))
            //     )
            //   )
            // );
            component = react_test_renderer_1.default.create(react_1.default.createElement(CComponent, props, react_1.default.createElement(CComponent, props, [])));
        });
        return component;
    },
    andWhen: async function (renderer, whenCB) {
        await (0, react_test_renderer_1.act)(() => whenCB(renderer));
        return renderer;
    },
};
