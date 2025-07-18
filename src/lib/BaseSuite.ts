import { ITTestResourceConfiguration, ITestArtifactory } from ".";
import { Ibdd_in_any, Ibdd_out_any } from "../CoreTypes";
import { IGivens, BaseCheck } from "./abstractBase";
import { beforeAllProxy, afterAllProxy } from "./pmProxy";
import { IPM } from "./types";

export abstract class BaseSuite<I extends Ibdd_in_any, O extends Ibdd_out_any> {
  name: string;
  givens: IGivens<I>;
  checks: BaseCheck<I>[];
  store: I["istore"];
  testResourceConfiguration: ITTestResourceConfiguration;
  index: number;
  failed: boolean;
  fails: number;

  constructor(
    name: string,
    index: number,
    givens: IGivens<I> = {},
    checks: BaseCheck<I>[] = []
  ) {
    this.name = name;
    this.index = index;
    this.givens = givens;
    this.checks = checks;
    this.fails = 0;
  }

  public features() {
    const features = Object.keys(this.givens)
      .map((k) => this.givens[k].features)
      .flat()
      .filter((value, index, array) => {
        return array.indexOf(value) === index;
      });
    return features || [];
  }

  public toObj() {
    const givens = Object.keys(this.givens).map((k) => this.givens[k].toObj());
    const checks = Object.keys(this.checks).map((k) => this.checks[k].toObj());

    return {
      name: this.name,
      givens,
      checks,
      fails: this.fails,
      failed: this.failed,
      features: this.features(),
    };
  }

  setup(
    s: I["iinput"],
    artifactory: ITestArtifactory,
    tr: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<I["isubject"]> {
    return new Promise((res) => res(s as unknown as I["isubject"]));
  }

  assertThat(t: Awaited<I["then"]> | undefined): boolean {
    return !!t;
  }

  afterAll(store: I["istore"], artifactory: ITestArtifactory, pm: IPM) {
    return store;
  }

  async run(
    input: I["iinput"],
    testResourceConfiguration: ITTestResourceConfiguration,
    artifactory: (fPath: string, value: unknown) => void,
    tLog: (...string) => void,
    pm: IPM
  ): Promise<BaseSuite<I, O>> {
    this.testResourceConfiguration = testResourceConfiguration;
    // tLog("test resources: ", JSON.stringify(testResourceConfiguration));

    const suiteArtifactory = (fPath: string, value: unknown) =>
      artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);

    // console.log("\nSuite:", this.index, this.name);
    tLog("\nSuite:", this.index, this.name);
    const sNdx = this.index;
    // const sName = this.name;

    const subject = await this.setup(
      input,
      suiteArtifactory,
      testResourceConfiguration,
      beforeAllProxy(pm, sNdx.toString())
    );

    for (const [gKey, g] of Object.entries(this.givens)) {
      const giver = this.givens[gKey];
      this.store = await giver
        .give(
          subject,
          gKey,
          testResourceConfiguration,
          this.assertThat,
          suiteArtifactory,
          tLog,
          pm,
          sNdx
        )
        .catch((e) => {
          this.failed = true;
          this.fails = this.fails + 1;
          console.error("Given error 1:", e);
          throw e;
        });
    }

    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(
        subject,
        thater.name,
        testResourceConfiguration,
        this.assertThat,
        suiteArtifactory,
        tLog,
        pm
      );
    }

    try {
      this.afterAll(
        this.store,
        artifactory,
        afterAllProxy(pm, sNdx.toString())
      );
    } catch (e) {
      console.error(e);
      // this.fails.push(this);
      // return this;
    }

    // @TODO fix me
    // for (const k of Object.keys(this.givens)) {
    //   const giver = this.givens[k];

    //   try {
    //     giver.afterAll(this.store, artifactory, pm);
    //   } catch (e) {
    //     console.error(e);
    //     this.fails.push(giver);
    //     return this;
    //   }
    // }
    ////////////////

    return this;
  }
}
