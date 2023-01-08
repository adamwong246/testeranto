// tests/httpServer/server.http.test.ts
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";

// tests/httpServer/http.testeranto.test.ts
import { assert } from "chai";
import { Testeranto } from "testeranto";
var HttpTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 1 },
  {
    beforeEach: async function(serverFactory2, initialValues, testResource) {
      const server = serverFactory2();
      await server.listen(testResource.ports[0]);
      return server;
    },
    andWhen: async function(store, actioner, testResource) {
      const [path, body] = actioner(store);
      const y = await fetch(
        `http://localhost:${testResource.ports[0]}/${path}`,
        {
          method: "POST",
          body
        }
      );
      return await y.text();
    },
    butThen: async function(store, callback, testResource) {
      const [path, expectation] = callback({});
      const bodytext = await (await fetch(`http://localhost:${testResource.ports[0]}/${path}`)).text();
      assert.equal(bodytext, expectation);
      return bodytext;
    },
    afterEach: function(server, ndx) {
      return new Promise((res) => {
        server.close(() => {
          res(true);
        });
      });
    }
  }
);

// tests/httpServer/server.ts
import http from "http";
var serverFactory = () => {
  let status = "some great status";
  let counter = 0;
  return http.createServer(function(req, res) {
    if (req.method === "GET") {
      if (req.url === "/get_status") {
        res.write(status);
        res.end();
        return;
      } else if (req.url === "/get_number") {
        res.write(counter.toString());
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
};

// tests/httpServer/server.http.test.ts
var myFeature = features.hello;
var ServerHttpTesteranto = HttpTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
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
      AnEmptyState: () => {
        return {};
      }
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the Node server with fetch",
        [
          Given.AnEmptyState(
            [myFeature],
            [],
            [Then.TheStatusIs("some great status")]
          ),
          Given.AnEmptyState(
            [myFeature],
            [When.PostToStatus("hello")],
            [Then.TheStatusIs("hello")]
          ),
          Given.AnEmptyState(
            [myFeature],
            [When.PostToStatus("hello"), When.PostToStatus("aloha")],
            [Then.TheStatusIs("aloha")]
          ),
          Given.AnEmptyState(
            [myFeature],
            [],
            [Then.TheNumberIs(0)]
          ),
          Given.AnEmptyState(
            [myFeature],
            [When.PostToAdd(1), When.PostToAdd(2)],
            [Then.TheNumberIs(3)]
          ),
          Given.AnEmptyState(
            [myFeature],
            [
              When.PostToStatus("aloha"),
              When.PostToAdd(4),
              When.PostToStatus("hello"),
              When.PostToAdd(3)
            ],
            [Then.TheStatusIs("hello"), Then.TheNumberIs(7)]
          )
        ],
        []
      )
    ];
  },
  serverFactory
);
export {
  ServerHttpTesteranto
};
