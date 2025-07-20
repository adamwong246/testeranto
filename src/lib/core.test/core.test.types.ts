import { Ibdd_in, Ibdd_out, ITestAdapter } from "../../CoreTypes";
import { MockCore } from "./MockCore";
import { ITTestResourceRequest } from "..";

export type I = Ibdd_in<
  {}, // iinput
  MockCore<any, any, any>, // isubject
  MockCore<any, any, any>, // istore
  MockCore<any, any, any>, // iselection
  () => MockCore<any, any, any>, // given
  (store: any) => any, // when
  (store: any) => any // then
>;

export type O = Ibdd_out<
  // Suites
  {
    Default: [string];
    ExtendedSuite: [description: string];
  },
  // Givens
  {
    Default: [];
    WithCustomInput: [input: any];
    WithResourceRequirements: [requirements: ITTestResourceRequest];
    WithCustomAdapter: [adapter: Partial<ITestAdapter<any>>];
  },
  // Whens
  {
    addArtifact: [artifact: Promise<any>];
    setTestJobs: [jobs: any[]];
    modifySpecs: [modifier: (specs: any[]) => any[]];
    triggerError: [message: string];
  },
  // Thens
  {
    initializedProperly: [];
    specsGenerated: [];
    jobsCreated: [];
    artifactsTracked: [];
    resourceRequirementsSet: [];
    interfaceConfigured: [];
    errorThrown: [expectedMessage: string];
    testRunSuccessful: [];
  },
  // Checks
  {
    Default: [];
  }
>;

export type M = {
  givens: {
    [K in keyof O["givens"]]: (
      ...args: O["givens"][K]
    ) => MockCore<any, any, any>;
  };
  whens: {
    [K in keyof O["whens"]]: (
      ...args: O["whens"][K]
    ) => (builder: MockCore<any, any, any>) => MockCore<any, any, any>;
  };
  thens: {
    [K in keyof O["thens"]]: (
      ...args: O["thens"][K]
    ) => (builder: MockCore<any, any, any>) => MockCore<any, any, any>;
  };
};
