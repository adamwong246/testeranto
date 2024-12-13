import {
  packageVersion
} from "./chunk-2CNFTRH6.mjs";
import {
  __commonJS,
  __toESM
} from "./chunk-3KGMXYRN.mjs";

// ../testeranto/node_modules/ws/browser.js
var require_browser = __commonJS({
  "../testeranto/node_modules/ws/browser.js"(exports, module) {
    "use strict";
    module.exports = function() {
      throw new Error(
        "ws does not work in the browser. Browser clients must use the native WebSocket object"
      );
    };
  }
});

// ../testeranto/node_modules/puppeteer-core/lib/esm/puppeteer/node/NodeWebSocketTransport.js
var import_ws = __toESM(require_browser(), 1);
var NodeWebSocketTransport = class {
  static create(url, headers) {
    return new Promise((resolve, reject) => {
      const ws = new import_ws.default(url, [], {
        followRedirects: true,
        perMessageDeflate: false,
        // @ts-expect-error https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketaddress-protocols-options
        allowSynchronousEvents: false,
        maxPayload: 256 * 1024 * 1024,
        // 256Mb
        headers: {
          "User-Agent": `Puppeteer ${packageVersion}`,
          ...headers
        }
      });
      ws.addEventListener("open", () => {
        return resolve(new NodeWebSocketTransport(ws));
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
  NodeWebSocketTransport
};
/*! Bundled license information:

puppeteer-core/lib/esm/puppeteer/node/NodeWebSocketTransport.js:
  (**
   * @license
   * Copyright 2018 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
