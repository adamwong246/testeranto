import http from "http";
import puppeteer from "puppeteer-core";
import { NodeWriter } from "./NodeWriter";
window.NodeWriter = NodeWriter;
const readJson = async (port) => new Promise((resolve, reject) => {
    let json = "";
    const request = http.request({
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
window.browser = new Promise(async (res, rej) => {
    const browser = await readJson("2999").then(async (json) => {
        const b = await puppeteer.connect({
            browserWSEndpoint: json.webSocketDebuggerUrl,
            defaultViewport: null,
        });
        console.log("connected!", b.isConnected());
        return res(b);
    });
});
