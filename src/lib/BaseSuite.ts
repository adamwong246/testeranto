/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITTestResourceConfiguration, ITestArtifactory } from ".";
import { Ibdd_in_any, Ibdd_out_any } from "../CoreTypes";
import { IGivens } from "./abstractBase";
import { beforeAllProxy, afterAllProxy } from "./pmProxy";
import { IPM } from "./types";

export abstract class BaseSuite<I extends Ibdd_in_any, O extends Ibdd_out_any> {
  name: string;
  givens: IGivens<I>;
  store: I["istore"];
  testResourceConfiguration: ITTestResourceConfiguration;
  index: number;
  failed: boolean;
  fails: number;

  constructor(name: string, index: number, givens: IGivens<I> = {}) {
    const suiteName = name || "testSuite"; // Ensure name is never undefined
    if (!suiteName) {
      throw new Error("BaseSuite requires a non-empty name");
    }
    console.log(
      "[DEBUG] BaseSuite constructor - name:",
      suiteName,
      "index:",
      index
    );
    this.name = suiteName;
    this.index = index;
    this.givens = givens;
    this.fails = 0;
    console.log("[DEBUG] BaseSuite initialized:", this.name, this.index);
    console.log("[DEBUG] BaseSuite givens:", Object.keys(givens).toString());
  }

  public features() {
    try {
      const features = Object.keys(this.givens)
        .map((k) => this.givens[k].features)
        .flat()
        .filter((value, index, array) => {
          return array.indexOf(value) === index;
        });
      console.debug("[DEBUG] Features extracted:", features.toString());
      return features || [];
    } catch (e) {
      console.error("[ERROR] Failed to extract features:", e);
      return [];
    }
  }

  public toObj() {
    const givens = Object.keys(this.givens).map((k) => this.givens[k].toObj());

    return {
      name: this.name,
      givens,
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
          // console.error("Given error 1:", e.toString());
          throw e;
        });
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

    return this;
  }
}
