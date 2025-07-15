import { Ibdd_in, Ibdd_out } from "../../CoreTypes";
import { ClassBuilder } from "../classBuilder";
import { ITTestResourceRequest } from "..";

export type I = Ibdd_in<
  {}, // iinput
  ClassBuilder<any, any, any>, // isubject
  ClassBuilder<any, any, any>, // istore
  ClassBuilder<any, any, any>, // iselection
  () => ClassBuilder<any, any, any>, // given
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
    WithCustomImplementation: [impl: ITestImplementation<any, any>];
    WithCustomSpecification: [spec: ITestSpecification<any, any>];
  },
  // Whens
  {
    addArtifact: [artifact: Promise<any>];
    setTestJobs: [jobs: ITestJob[]];
    modifySpecs: [modifier: (specs: any[]) => any[]];
    modifyJobs: [modifier: (jobs: ITestJob[]) => ITestJob[]];
    triggerError: [message: string];
  },
  // Thens
  {
    initializedProperly: [];
    specsGenerated: [];
    jobsCreated: [];
    artifactsTracked: [];
    resourceRequirementsSet: [];
    suitesOverridesConfigured: [];
    givensOverridesConfigured: [];
    whensOverridesConfigured: [];
    thensOverridesConfigured: [];
    checksOverridesConfigured: [];
    specsModified: [expectedCount: number];
    jobsModified: [expectedCount: number];
    errorThrown: [expectedMessage: string];
    testRunSuccessful: [];
  },
  // Checks
  {
    Default: [];
    ImplementationCheck: [validator: (impl: any) => boolean];
    SpecificationCheck: [validator: (spec: any) => boolean];
  }
>;

export type M = {
  givens: {
    [K in keyof O["givens"]]: (...args: O["givens"][K]) => ClassBuilder<any, any, any>;
  };
  whens: {
    [K in keyof O["whens"]]: (...args: O["whens"][K]) => (builder: ClassBuilder<any, any, any>) => ClassBuilder<any, any, any>;
  };
  thens: {
    [K in keyof O["thens"]]: (...args: O["thens"][K]) => (builder: ClassBuilder<any, any, any>) => ClassBuilder<any, any, any>;
  };
};
