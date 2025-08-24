/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
  ITestAdapter,
} from "../../CoreTypes";

import { ITestJob, ITTestResourceRequest } from "..";

import Tiposkripto from "../Tiposkripto";

export type I = Ibdd_in<
  {}, // iinput
  Tiposkripto<any, any, any>, // isubject
  Tiposkripto<any, any, any>, // istore
  Tiposkripto<any, any, any>, // iselection
  () => Tiposkripto<any, any, any>, // given
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
    WithCustomAdapter: [adapter: Partial<ITestAdapter<any>>];
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
    interfaceConfigured: [];
    specsModified: [expectedCount: number];
    jobsModified: [expectedCount: number];
    errorThrown: [expectedMessage: string];
    testRunSuccessful: [];
  }
>;

export type M = {
  givens: {
    [K in keyof O["givens"]]: (
      ...args: O["givens"][K]
    ) => Tiposkripto<any, any, any>;
  };
  whens: {
    [K in keyof O["whens"]]: (
      ...args: O["whens"][K]
    ) => (builder: Tiposkripto<any, any, any>) => Tiposkripto<any, any, any>;
  };
  thens: {
    [K in keyof O["thens"]]: (
      ...args: O["thens"][K]
    ) => (builder: Tiposkripto<any, any, any>) => Tiposkripto<any, any, any>;
  };
};
