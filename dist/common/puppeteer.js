"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
exports.default = async (port) => new Promise((resolve, reject) => {
    let json = "";
    const request = http_1.default.request({
        host: "127.0.0.1",
        path: "/json/version",
        port,
    }, (response) => {
        response.on("error", reject);
        response.on("data", (chunk) => {
            json += chunk.toString();
        });
        response.on("end", () => {
            resolve(JSON.parse(json));
        });
    });
    request.on("error", reject);
    request.end();
});
