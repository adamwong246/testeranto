import { serverFactory } from "../../src/server";

import { features } from "../testerantoFeatures.test.mjs";
import { HttpTesteranto } from "./http.testeranto.test";

const myFeature = `hello`;

export const ServerHttpTesteranto = HttpTesteranto<
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
  },
  typeof features
>(
  serverFactory,
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      /* @ts-ignore:next-line */
      AnEmptyState: () => {
        return {};
      },
    },
    Whens: {
      PostToStatus: (status: string) => ["put_status", status],
      PostToAdd: (n: number) => ["put_number", n.toString()],
    },
    Thens: {
      TheStatusIs: (status: string) => () => ["get_status", status],
      TheNumberIs: (number: number) => () => ["get_number", number],
    },
    Checks: {
      /* @ts-ignore:next-line */
      AnEmptyState: () => {
        return {};
      },
    },
  },

  (Suite, Given, When, Then, Check) => {
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
            [When.PostToStatus("hello")],
            [Then.TheStatusIs("hello")]
          )
        }, []
        // [
        //   Given.AnEmptyState(
        //     [myFeature],
        //     [],
        //     [Then.TheStatusIs("some great status")]
        //   ),
        //   Given.AnEmptyState(
        //     [myFeature],
        //     [When.PostToStatus("hello")],
        //     [Then.TheStatusIs("hello")]
        //   ),
        //   Given.AnEmptyState(
        //     [myFeature],
        //     [When.PostToStatus("hello"), When.PostToStatus("aloha")],
        //     [Then.TheStatusIs("aloha")]
        //   ),
        //   Given.AnEmptyState(
        //     [myFeature],
        //     [],
        //     [Then.TheNumberIs(0)]
        //   ),
        //   Given.AnEmptyState(
        //     [myFeature],
        //     [When.PostToAdd(1), When.PostToAdd(2)],
        //     [Then.TheNumberIs(3)]
        //   ),
        //   Given.AnEmptyState(
        //     [myFeature],
        //     [
        //       When.PostToStatus("aloha"),
        //       When.PostToAdd(4),
        //       When.PostToStatus("hello"),
        //       When.PostToAdd(3),
        //     ],
        //     [Then.TheStatusIs("hello"), Then.TheNumberIs(7)]
        //   ),
        // ],
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
      ),
    ];
  },


  "server"

);
