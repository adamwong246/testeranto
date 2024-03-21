


declare module 'tests.test.js' {

  type ITestTypes = [
    string,
    IRunTime,
    ITestTypes[]
  ];

  const content: {
    tests: ITestTypes[]
  };
  export default content;
}


declare module 'features.test.js' {
  import { TesterantoFeatures } from "./src/Features";
  const content: {
    features: TesterantoFeatures
  };
  export default content;
}

