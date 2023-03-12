// myTests/httpServer/http2x.testeranto.test.ts
import { assert } from "chai";
import { Testeranto } from "testeranto";
var Http2xTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 2 },
  {
    beforeEach: async function(serverFactory2, initialValues, testResource) {
      const serverA = serverFactory2();
      await serverA.listen(testResource.ports[0]);
      const serverB = serverFactory2();
      await serverB.listen(testResource.ports[1]);
      return { serverA, serverB };
    },
    afterEach: function({ serverA, serverB }, ndx) {
      return new Promise((res) => {
        serverA.close(() => {
          serverB.close(() => {
            res(true);
          });
        });
      });
    },
    andWhen: async function(store, actioner, testResource) {
      const [path, body, portSlot] = actioner(store);
      const y = await fetch(
        `http://localhost:${testResource.ports[portSlot]}/${path}`,
        {
          method: "POST",
          body
        }
      );
      return await y.text();
    },
    butThen: async function(store, callback, testResource) {
      const [path, expectation, portSlot] = callback({});
      const bodytext = await (await fetch(`http://localhost:${testResource.ports[portSlot]}/${path}`)).text();
      assert.equal(bodytext, expectation);
      return bodytext;
    }
  }
);

// myTests/httpServer/server.ts
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

// myTests/httpServer/server.http2x.test.ts
var myFeature = `hello`;
var ServerHttp2xTesteranto = Http2xTesteranto(
  {
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
      PostToStatusA: (status) => ["put_status", status, 0],
      PostToAddA: (n) => ["put_number", n.toString(), 0],
      PostToStatusB: (status) => ["put_status", status, 1],
      PostToAddB: (n) => ["put_number", n.toString(), 1]
    },
    Thens: {
      TheStatusIsA: (status) => () => ["get_status", status, 0],
      TheNumberIsA: (number) => () => ["get_number", number, 0],
      TheStatusIsB: (status) => () => ["get_status", status, 1],
      TheNumberIsB: (number) => () => ["get_number", number, 1]
    },
    Checks: {
      /* @ts-ignore:next-line */
      AnEmptyState: () => {
        return {};
      }
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the Node server with fetch * 2 ports",
        [
          Given.AnEmptyState(
            [myFeature],
            [],
            [Then.TheStatusIsA("some great status")]
          ),
          Given.AnEmptyState(
            [myFeature],
            [
              When.PostToStatusA("gutentag"),
              When.PostToStatusB("buenos dias")
            ],
            [
              Then.TheStatusIsA("gutentag"),
              Then.TheStatusIsB("buenos dias")
            ]
          )
        ],
        []
      )
    ];
  },
  serverFactory
);
export {
  ServerHttp2xTesteranto
};
