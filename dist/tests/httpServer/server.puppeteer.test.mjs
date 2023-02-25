// tests/httpServer/puppeteer-http.testeranto.test.ts
import puppeteer from "puppeteer";
import { assert } from "chai";
import { Testeranto } from "testeranto";
var PuppeteerHttpTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 1 },
  {
    beforeEach: function(serverFactory2, initialValues, testResource) {
      return new Promise((res) => {
        puppeteer.launch({
          headless: true,
          executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        }).then((browser) => {
          const server = serverFactory2();
          res({ server: server.listen(testResource.ports[0]), browser });
        });
      });
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
      const [path, expectation] = callback(store);
      const bodytext = await (await fetch(`http://localhost:${testResource.ports[0]}/${path}`)).text();
      assert.equal(bodytext, expectation);
      return bodytext;
    },
    afterEach: function(store, ndx) {
      return new Promise((resolve) => {
        store.browser.close();
        store.server.close(() => {
          resolve();
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

// tests/httpServer/server.puppeteer.test.ts
var myFeature = `hello`;
var ServerHttpPuppeteerTesteranto = PuppeteerHttpTesteranto(
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
      TheStatusIs: (status) => (store) => ["get_status", status],
      TheNumberIs: (number) => (store) => ["get_number", number]
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
        "Testing the Server with Puppeteer",
        [
          Given.AnEmptyState(
            [],
            [],
            [Then.TheStatusIs("some great status")]
          ),
          Given.AnEmptyState(
            [],
            [When.PostToStatus("goodbye")],
            [Then.TheStatusIs("aloha")]
          ),
          Given.AnEmptyState(
            [myFeature],
            [When.PostToStatus("hello"), When.PostToStatus("aloha")],
            [Then.TheStatusIs("aloha")]
          ),
          Given.AnEmptyState(
            [],
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
          //   "puppeteer imperative style",
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
          //   "puppeteer imperative style II",
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
  ServerHttpPuppeteerTesteranto
};
