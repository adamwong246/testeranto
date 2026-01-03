declare module "*.test.js" {
  type ITestTypes = [string, IRunTime, ITestTypes[]];
  const content: ITestTypes[];
  export default content;
}
