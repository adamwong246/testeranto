import { Ibdd_in, Ibdd_out } from "../src/CoreTypes";
import { Calculator } from "./Calculator";

export type I = Ibdd_in<
  typeof Calculator, // iinput
  typeof Calculator, // isubject
  Calculator, // istore
  string, // iselection (getDisplay returns string)
  () => Calculator, // given
  (calculator: Calculator) => Calculator, // when
  (calculator: Calculator) => void // then
>;

export type O = Ibdd_out<
  {
    Default: [string];
  },
  {
    Default: [];
  },
  {
    press: [string];
    enter: [];
    memoryStore: [];
    memoryRecall: [];
    memoryClear: [];
    memoryAdd: [];
  },
  {
    result: [string];
  }
>;

export type M = {
  givens: {
    [K in keyof O["givens"]]: (...args: O["givens"][K]) => Calculator;
  };
  whens: {
    [K in keyof O["whens"]]: (
      ...args: O["whens"][K]
    ) => (calculator: Calculator) => Calculator;
  };
  thens: {
    [K in keyof O["thens"]]: (
      ...args: O["thens"][K]
    ) => (calculator: Calculator) => void;
  };
};
