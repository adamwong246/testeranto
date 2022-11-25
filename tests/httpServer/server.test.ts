import { assert } from "chai";
import { ITypeDeTuple } from "../../src/shared";

import HttpTesterantoFactory from "./http.testerano.test";

import { serverFactory } from "./server";

type ISuites = {
  Default: string;
};

type IGivens = {
  AnEmptyState: [never];
};

type IWhens = {
  PostToStatus: [string];
  PostToAdd: [number];
};

type IThens = {
  TheStatusIs: [string];
  TheNumberIs: [number];
};

const ServerTesteranto = HttpTesterantoFactory<
  ISuites,
  IGivens,
  IWhens,
  IThens
>(serverFactory, (Suite, Given, When, Then) => {
  return [
    Suite.Default("idk", [
      Given.AnEmptyState(
        "a boringfeature",
        [],
        [Then.TheStatusIs("some great status")]
      ),

      Given.AnEmptyState(
        "a feature",
        [When.PostToStatus("hello")],
        [Then.TheStatusIs("hello")]
      ),

      Given.AnEmptyState(
        "a feature",
        [When.PostToStatus("hello"), When.PostToStatus("aloha")],
        [Then.TheStatusIs("aloha")]
      ),

      Given.AnEmptyState("a feature", [], [Then.TheNumberIs(0)]),

      Given.AnEmptyState(
        "a feature",
        [When.PostToAdd(1), When.PostToAdd(2)],
        [Then.TheNumberIs(3)]
      ),

      Given.AnEmptyState(
        "another feature",
        [
          // When.PostToStatus("aloha"),
          When.PostToAdd(4),
          // When.PostToStatus("hello"),
          When.PostToAdd(3),
        ],
        [
          // Then.TheStatusIs("hello"),
          Then.TheNumberIs(7),
        ]
      ),
    ]),
  ];
});

const suites: Record<keyof ISuites, string> = {
  Default: "some default Suite",
};

const givens: ITypeDeTuple<IGivens, any> = {
  /* @ts-ignore:next-line */
  AnEmptyState: () => {}, //loginApp.getInitialState(),
};

const whens: ITypeDeTuple<IWhens, any> = {
  PostToStatus: (status: string) => () => {
    return ["put_status", status];
  },
  PostToAdd: (number: number) => () => ["put_number", number],
};

const thens: ITypeDeTuple<IThens, any> = {
  TheStatusIs: (status: string) => () => ["get_status", status],
  TheNumberIs: (number: number) => () => ["get_number", number],
};

export default async () => {
  /* @ts-ignore:next-line */
  await ServerTesteranto.run(suites, givens, whens, thens);
};
