var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// myTests/httpServer/http.testeranto.test.ts
import { assert } from "chai";
import { Testeranto } from "testeranto";
var HttpTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 1 },
  {
    beforeEach: function(serverFactory2, initialValues, testResource) {
      return __async(this, null, function* () {
        const server = serverFactory2();
        yield server.listen(testResource.ports[0]);
        return server;
      });
    },
    andWhen: function(store, actioner, testResource) {
      return __async(this, null, function* () {
        const [path, body] = actioner(store);
        const y = yield fetch(
          `http://localhost:${testResource.ports[0]}/${path}`,
          {
            method: "POST",
            body
          }
        );
        return yield y.text();
      });
    },
    butThen: function(store, callback, testResource) {
      return __async(this, null, function* () {
        const [path, expectation] = callback({});
        const bodytext = yield (yield fetch(`http://localhost:${testResource.ports[0]}/${path}`)).text();
        assert.equal(bodytext, expectation);
        return bodytext;
      });
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

// myTests/httpServer/server.http.test.ts
var myFeature = `hello`;
var ServerHttpTesteranto = HttpTesteranto(
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
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the Node server with fetch!",
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
        [
          // Check.AnEmptyState(
          //   "HTTP imperative style",
          //   async ({ PostToAdd }, { TheNumberIs }) => {
          //     await PostToAdd(2);
          //     await PostToAdd(3);
          //     await TheNumberIs(5);
          //     await PostToAdd(2);
          //     await TheNumberIs(7);
          //     await PostToAdd(3);
          //     await TheNumberIs(10);
          //   }
          // ),
          // Check.AnEmptyState(
          //   "HTTP imperative style II",
          //   async ({ PostToAdd }, { TheNumberIs }) => {
          //     const a = await PostToAdd(2);
          //     const b = parseInt(await PostToAdd(3));
          //     await TheNumberIs(b);
          //     await PostToAdd(2);
          //     await TheNumberIs(7);
          //     await PostToAdd(3);
          //     await TheNumberIs(10);
          //     assert.equal(await PostToAdd(-15), -5);
          //     await TheNumberIs(-5);
          //   }
          // ),
        ]
      )
    ];
  },
  serverFactory
);
export {
  ServerHttpTesteranto
};
