import { NodeWriter } from "./NodeWriter";
console.log("hello preload send", process.send);
console.log("hello preload stdin", process.stdin);
window.NodeWriter = NodeWriter;
