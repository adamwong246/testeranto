import { IBaseTest } from "testeranto/src/Types";

export type IMyFirstContractTest<Input> = {
  iinput: Input;
  isubject: string;
  istore: string;
  iselection: string;
  given: string;
  when: string;
  then: string;
  suites: {
    Default: string;
  };
  givens: {
    Default: [string];
  };
  whens: {
    Increment: [number];
    Decrement: [number];
  };
  thens: {
    Get: [{ asTestUser: number; expectation: number }];
  };
  checks: {
    AnEmptyState: [];
  };
} & IBaseTest;
