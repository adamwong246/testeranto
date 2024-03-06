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

const startup = async (
  testResourceArg: string,
  t: ITestJob,
  testResourceRequirement: ITTestResourceRequirement
) => {
  return
};

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
    {
      createWriteStream: (filepath: string) => {
        return
        // return fs.createWriteStream(filepath);
      },
      writeFileSync: (fp: string, contents: string) => {
        return
        // fs.writeFileSync(
        //   fp,
        //   contents
        // );
      },
      mkdirSync: (fp: string) => {
        return;
      },
      testArtiFactoryfileWriter:
        (tLog: ITLog) => (fp) => (givenNdx) => (key, value: string | Buffer) => {
          tLog("testArtiFactory =>", key);

          const fPath = `${fp}/${givenNdx}/${key}`;
          // const cleanPath = path.resolve(fPath);
          // fPaths.push(cleanPath.replace(process.cwd(), ``));

          // const targetDir = cleanPath.split("/").slice(0, -1).join("/");

          // fs.mkdir(targetDir, { recursive: true }, async (error) => {
          //   if (error) {
          //     console.error(`❗️testArtiFactory failed`, targetDir, error);
          //   }

          //   fs.writeFileSync(
          //     path.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"),
          //     fPaths.join(`\n`),
          //     {
          //       encoding: "utf-8",
          //     }
          //   );

          //   if (Buffer.isBuffer(value)) {
          //     fs.writeFileSync(fPath, value, "binary");
          //   } else if (`string` === typeof value) {
          //     fs.writeFileSync(fPath, value.toString(), {
          //       encoding: "utf-8",
          //     });
          //   } else {
          //     /* @ts-ignore:next-line */
          //     const pipeStream: PassThrough = value;
          //     var myFile = fs.createWriteStream(fPath);
          //     pipeStream.pipe(myFile);
          //     pipeStream.on("close", () => {
          //       myFile.close();
          //     });
          //   }
          // });
        },

      startup
    }
  );
  const t: ITestJob = mrt[0];
  const testResourceArg = `{"fs": ".", "ports": []}`;
  try {
    startup(testResourceArg, t, testResourceRequirement);
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
};
