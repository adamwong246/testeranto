"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_static_1 = __importDefault(require("node-static"));
const http_1 = __importDefault(require("http"));
const main = async () => {
    process.chdir("../"); // Navigate one level up
    const fileServer = new node_static_1.default.Server(".", {});
    http_1.default
        .createServer(function (request, response) {
        request
            .addListener("end", function () {
            fileServer.serve(request, response);
        })
            .resume();
    })
        .listen(8080);
    console.log("Server running on port 8080");
};
main();
