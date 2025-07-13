"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = (r) => {
    return {
        name: "rebuild-notify",
        setup: (build) => {
            build.onStart(() => {
                console.log(`> web build starting...`);
            });
            build.onEnd((result) => {
                console.log(`> web build ended with ${result.errors.length} errors`);
                if (result.errors.length > 0) {
                    fs_1.default.writeFileSync(`./${r}_build_errors`, JSON.stringify(result));
                }
            });
        },
    };
};
