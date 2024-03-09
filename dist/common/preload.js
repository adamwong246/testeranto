"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeWriter_1 = require("./NodeWriter");
console.log("hello preload send", process.send);
console.log("hello preload stdin", process.stdin);
window.NodeWriter = NodeWriter_1.NodeWriter;
