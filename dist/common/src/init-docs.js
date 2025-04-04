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
const fs_1 = __importDefault(require("fs"));
const Init_1 = __importDefault(require("./Init"));
// import Init from "../dist/module/src/Init";
console.log("Initializing a testeranto project");
if (!process.argv[2]) {
    console.log("You didn't pass a config file, so I will create one for you.");
    fs_1.default.writeFileSync("testeranto.mts", fs_1.default.readFileSync("node_modules/testeranto/src/defaultConfig.ts"));
    Promise.resolve(`${process.cwd() + "/" + "testeranto.mts"}`).then(s => __importStar(require(s))).then((module) => {
        (0, Init_1.default)(module.default);
    });
}
else {
    Promise.resolve(`${process.cwd() + "/" + process.argv[2]}`).then(s => __importStar(require(s))).then((module) => {
        (0, Init_1.default)(module.default);
    });
}
