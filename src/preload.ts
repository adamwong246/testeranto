import { NodeWriter } from "./NodeWriter";

console.log("hello preload", process.argv);
console.log("hello preload send", process.send);

(window as any).NodeWriter = NodeWriter;

