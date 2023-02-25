import { assert } from "chai";
import { features } from "../testerantoFeatures.test";
import { PuppeteerHttpTesteranto } from "./puppeteer-http.testeranto.test";
import { serverFactory } from "./server";

const myFeature = `hello`;

export const ServerHttpPuppeteerTesteranto = PuppeteerHttpTesteranto<
  {
    suites: {
      Default: string;
    };
    givens: {
      AnEmptyState: [];
    };
    whens: {
      PostToStatus: [string];
      PostToAdd: [number];
    };
    thens: {
      TheStatusIs: [string];
      TheNumberIs: [number];
    };
    checks: {
      AnEmptyState;
    };
  }
>(
  {
    Suites: {
      Default: "some default Suite",
    },
    Givens: {
      AnEmptyState: () => {
        return {};
      },
    },
    Whens: {
      PostToStatus: (status) => ["put_status", status],
      PostToAdd: (n) => ["put_number", n.toString()],
    },
    Thens: {
      TheStatusIs: (status) => (store) => ["get_status", status],
      TheNumberIs: (number) => (store) => ["get_number", number],
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      },
    },
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
            [], [], [Then.TheNumberIs(0)]),
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
              When.PostToAdd(3),
            ],
            [Then.TheStatusIs("hello"), Then.TheNumberIs(7)]
          ),
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
      ),
    ];
  },

  serverFactory

);
