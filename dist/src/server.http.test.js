"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server.http.test.ts
var server_http_test_exports = {};
__export(server_http_test_exports, {
  ServerHttpTesteranto: () => ServerHttpTesteranto
});
module.exports = __toCommonJS(server_http_test_exports);

// src/server.ts
var import_http = __toESM(require("http"), 1);
var htmlTemplate = (jsbundle) => `
<!DOCTYPE html><html lang="en">
  <head>
    <script type="module" src="./ClassicalComponent">
      ${jsbundle}
    </script>
    <script type="module">
      import { LaunchClassicalComponent } from "ClassicalComponent";
      LaunchClassicalComponent();
    </script>
  </head>

  <body>
    <h2>hello esbuild-puppeteer.testeranto</h2>
    <div id="root">
    </div>
  </body>

  <footer></footer>
</html>`;
var serverFactory = () => {
  let status = "some great status";
  let counter = 0;
  const server = import_http.default.createServer(function(req, res) {
    if (req.method === "GET") {
      if (req.url === "/get_status") {
        res.write(status);
        res.end();
        return;
      } else if (req.url === "/get_number") {
        res.write(counter.toString());
        res.end();
        return;
      } else if (req.url === "/classical_component") {
        res.write(htmlTemplate("ClassicalComponent.js"));
        res.end();
        return;
      } else if (req.url === "/login_page") {
        res.write(htmlTemplate("LoginPage.js"));
        res.end();
        return;
      } else {
        res.write("<p>error 404<p>");
        res.end();
        return;
      }
    } else if (req.method === "POST") {
      let body = "";
      req.on("data", function(chunk) {
        body += chunk;
      });
      req.on("end", function() {
        if (req.url === "/put_status") {
          status = body.toString();
          res.write("aok");
          res.end();
          return;
        } else if (req.url === "/put_number") {
          counter = counter + parseInt(body);
          res.write(counter.toString());
          res.end();
          return;
        } else {
          res.write("<p>error 404<p>");
          res.end();
          return;
        }
      });
    }
  });
  return server;
};

// src/server.test.ts
var myFeature = `hello`;
var ServerTestImplementation = {
  Suites: {
    Default: "some default Suite"
  },
  Givens: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    }
  },
  Whens: {
    PostToStatus: (status) => ["put_status", status],
    PostToAdd: (n) => ["put_number", n.toString()]
  },
  Thens: {
    TheStatusIs: (status) => () => ["get_status", status],
    TheNumberIs: (number) => () => ["get_number", number]
  },
  Checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    }
  }
};
var ServerTestSpecification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Node server with fetch!",
      {
        "test0": Given.AnEmptyState(
          [myFeature],
          [],
          [Then.TheStatusIs("some great status")]
        ),
        "test1": Given.AnEmptyState(
          [myFeature],
          [
            When.PostToStatus("1"),
            When.PostToStatus("2"),
            When.PostToStatus("3"),
            When.PostToStatus("4"),
            When.PostToStatus("5"),
            When.PostToStatus("6"),
            When.PostToStatus("hello")
          ],
          [Then.TheStatusIs("hello")]
        ),
        "test2": Given.AnEmptyState(
          [myFeature],
          [When.PostToStatus("hello"), When.PostToStatus("aloha")],
          [Then.TheStatusIs("aloha")]
        ),
        "test2.5": Given.AnEmptyState(
          [myFeature],
          [When.PostToStatus("hola")],
          [Then.TheStatusIs("hola")]
        ),
        "test3": Given.AnEmptyState(
          [myFeature],
          [],
          [
            Then.TheNumberIs(0)
          ]
        ),
        "test5": Given.AnEmptyState(
          [myFeature],
          [When.PostToAdd(1), When.PostToAdd(2)],
          [Then.TheNumberIs(3)]
        ),
        "test6": Given.AnEmptyState(
          [myFeature],
          [
            When.PostToStatus("aloha"),
            When.PostToAdd(4),
            When.PostToStatus("hello"),
            When.PostToAdd(3)
          ],
          [Then.TheStatusIs("hello"), Then.TheNumberIs(7)]
        )
      },
      []
      // [
      // // Check.AnEmptyState(
      // //   "HTTP imperative style",
      // //   async ({ PostToAdd }, { TheNumberIs }) => {
      // //     await PostToAdd(2);
      // //     await PostToAdd(3);
      // //     await TheNumberIs(5);
      // //     await PostToAdd(2);
      // //     await TheNumberIs(7);
      // //     await PostToAdd(3);
      // //     await TheNumberIs(10);
      // //   }
      // // ),
      // // Check.AnEmptyState(
      // //   "HTTP imperative style II",
      // //   async ({ PostToAdd }, { TheNumberIs }) => {
      // //     const a = await PostToAdd(2);
      // //     const b = parseInt(await PostToAdd(3));
      // //     await TheNumberIs(b);
      // //     await PostToAdd(2);
      // //     await TheNumberIs(7);
      // //     await PostToAdd(3);
      // //     await TheNumberIs(10);
      // //     assert.equal(await PostToAdd(-15), -5);
      // //     await TheNumberIs(-5);
      // //   }
      // // ),
      // ]
    )
  ];
};

// myTests/http.testeranto.test.ts
var import_chai = require("chai");
var import_core_node = __toESM(require("testeranto/src/core-node"), 1);
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
var HttpTesteranto = (testInput, testImplementations, testSpecifications) => (0, import_core_node.default)(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeEach: async function(serverFactory2, initialValues, testResource) {
      const server = serverFactory2();
      return new Promise((res, rej) => {
        server.timeout = 0;
        server.keepAliveTimeout = 0;
        server.listen(testResource.ports[0], async () => {
          await sleep(1);
          res(server);
        });
      });
    },
    andWhen: async function(store, actioner, testResource) {
      const [path, body] = actioner(store);
      return fetch(
        `http://localhost:${testResource.ports[0]}/${path}`,
        {
          method: "POST",
          body,
          keepalive: false
        }
      ).then(async (r) => {
        return await r.text();
      });
    },
    butThen: async function(store, callback, testResource) {
      const [path, expectation] = callback({});
      return fetch(`http://localhost:${testResource.ports[0]}/${path}`, {
        keepalive: false
      }).then(async (r) => {
        const bodytext = await r.text();
        import_chai.assert.equal(bodytext, expectation);
        return bodytext;
      });
    },
    afterEach: function(store, key, artificer) {
      return new Promise((res) => {
        store.closeAllConnections();
        store.close(async (e) => {
          await sleep(1);
          res();
        });
      });
    }
  },
  { ports: 1 }
);

// src/server.http.test.ts
var ServerHttpTesteranto = HttpTesteranto(
  serverFactory,
  ServerTestImplementation,
  ServerTestSpecification
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ServerHttpTesteranto
});
