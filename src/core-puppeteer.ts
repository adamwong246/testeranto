import {
  ITLog,
  ITTestResourceConfiguration,
  ITTestResourceRequirement,
  ITTestShape,
  ITestArtificer,
  ITestJob,
  ITestSpecification,
  defaultTestResourceRequirement,
} from "./core";
import TesterantoLevelTwo from "./core";

export default async <
  TestShape extends ITTestShape,
  Input,
  Subject extends Input,
  Store,
  Selection,
  WhenShape,
  ThenShape,
  InitialStateShape
>(
  input: Input,
  testSpecification: ITestSpecification<TestShape>,
  testImplementation,
  testInterface: {
    actionHandler?: (b: (...any) => any) => any;
    andWhen: (
      store: Store,
      actioner,
      testResource: ITTestResourceConfiguration
    ) => Promise<Selection>;
    butThen?: (
      store: Store,
      callback,
      testResource: ITTestResourceConfiguration
    ) => Promise<Selection>;
    assertioner?: (t: ThenShape) => any;

    afterAll?: (store: Store, artificer: ITestArtificer) => any;
    afterEach?: (
      store: Store,
      key: string,
      artificer: ITestArtificer
    ) => Promise<unknown>;
    beforeAll?: (input: Input, artificer: ITestArtificer) => Promise<Subject>;
    beforeEach?: (
      subject: Subject,
      initialValues,
      testResource: ITTestResourceConfiguration,
      artificer: ITestArtificer
    ) => Promise<Store>;
  },
  nameKey: string,
  testResourceRequirement: ITTestResourceRequirement = defaultTestResourceRequirement
) => {
  const mrt = new TesterantoLevelTwo(
    input,
    testSpecification,
    testImplementation,
    testInterface,
    nameKey,
    testResourceRequirement,
    testInterface.assertioner || (async (t) => t as any),
    testInterface.beforeEach ||
    async function (subject: Input, initialValues: any, testResource: any) {
      return subject as any;
    },
    testInterface.afterEach || (async (s) => s),
    testInterface.afterAll || ((store: Store) => undefined),
    testInterface.butThen || (async (a) => a as any),
    testInterface.andWhen,
    testInterface.actionHandler ||
    function (b: (...any: any[]) => any) {
      return b;
    },
    // {
    //   createWriteStream: window.createWriteStream(),
    // }
    (window as any).NodeWriter()
  );
  const t: ITestJob = mrt[0];
  // const testResourceArg = `{"fs": ".", "ports": []}`;
  const testResourceArg = `{}`;
  try {
    const x = await (window as any).NodeWriter();
    console.log("window.NodeWriter", x)
    await (window as any).NodeWriter().startup(testResourceArg, t, testResourceRequirement);
  } catch (e) {
    console.error(e);
    // process.exit(-1);
  }
};
