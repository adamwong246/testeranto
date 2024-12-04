// node_modules/puppeteer-core/lib/esm/puppeteer/common/BrowserWebSocketTransport.js
var BrowserWebSocketTransport = class {
  static create(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.addEventListener("open", () => {
        return resolve(new BrowserWebSocketTransport(ws));
      });
      ws.addEventListener("error", reject);
    });
  }
  #ws;
  onmessage;
  onclose;
  constructor(ws) {
    this.#ws = ws;
    this.#ws.addEventListener("message", (event) => {
      if (this.onmessage) {
        this.onmessage.call(null, event.data);
      }
    });
    this.#ws.addEventListener("close", () => {
      if (this.onclose) {
        this.onclose.call(null);
      }
    });
    this.#ws.addEventListener("error", () => {
    });
  }
  send(message) {
    this.#ws.send(message);
  }
  close() {
    this.#ws.close();
  }
};

export {
  BrowserWebSocketTransport
};
