import { IProps, IState } from ".";

export type IClassicalComponentSpec = {
  iinput: void;
  isubject: void;
  istore: void;
  iselection: any;

  when: void;
  then: void;
  given: IProps;

  suites: {
    Default: [string];
  };
  givens: {
    AnEmptyState: [];
  };
  whens: {
    IClickTheButton: [];
    IClickTheHeader: [];
  };
  thens: {
    ThePropsIs: [IProps];
    TheStatusIs: [IState];
  };
  checks: {
    AnEmptyState;
  };
};
