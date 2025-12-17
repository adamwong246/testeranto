/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { PassThrough } from "stream";
import { NonEmptyObject } from "type-fest";
import type {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestAdapter,
  ITestImplementation,
  ITestSpecification,
} from "../CoreTypes";
import { BaseGiven, IGivens } from "./BaseGiven";
import { BaseSuite } from "./BaseSuite";
import { BaseThen } from "./BaseThen.js";
import { BaseWhen } from "./BaseWhen.js";
import {
  DefaultAdapter,
  defaultTestResourceRequirement,
  IFinalResults,
  ITestArtifactory,
  ITestJob,
  // ITLog,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
} from "./index.js";
// import { IPM } from "./types.js";
// import { PM_Node } from "../clients/node.js";

type IExtenstions = Record<string, unknown>;

import WebSocket from "ws";
// import { PM } from "../clients";

export default class Tiposkripto<
  I extends Ibdd_in_any = Ibdd_in_any,
  O extends Ibdd_out_any = Ibdd_out_any,
  M = unknown
> {
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  // private totalTests: number;

  protected ws: WebSocket | null = null;

  artifacts: Promise<unknown>[] = [];
  assertThis: (t: I["then"]) => any;
  givenOverides: Record<keyof IExtenstions, any>;
  specs: any;
  suitesOverrides: Record<keyof IExtenstions, any>;
  testJobs: ITestJob[];
  testResourceRequirement: ITTestResourceRequest;
  testSpecification: ITestSpecification<I, O>;
  thenOverides: Record<keyof IExtenstions, any>;
  whenOverides: Record<keyof IExtenstions, any>;

  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M> & {
      suites: Record<string, NonEmptyObject<object>>;
      givens: Record<string, any>;
      whens: Record<string, any>;
      thens: Record<string, any>;
    },
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    testAdapter: Partial<ITestAdapter<I>> = {},
    // uberCatcher: string,
    port: string,
    host: string
  ) {
    const fullAdapter = DefaultAdapter<I>(testAdapter);

    // Create classy implementations
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring: string, givens: IGivens<I>) => {
          return new (class extends BaseSuite<I, O> {
            afterAll(
              store: I["istore"],
              artifactory: ITestArtifactory
              // pm: IPM
            ) {
              return fullAdapter.afterAll(store);
            }

            assertThat(t: Awaited<I["then"]>): boolean {
              return fullAdapter.assertThis(t);
            }

            async setup(
              s: I["iinput"],
              artifactory: ITestArtifactory,
              tr: ITTestResourceConfiguration
              // pm: IPM
            ): Promise<I["isubject"]> {
              return (
                fullAdapter.beforeAll?.(s, tr) ??
                (s as unknown as Promise<I["isubject"]>)
              );
            }
          })(somestring, index, givens);
        };
        return a;
      },
      {}
    );

    const classyGivens = Object.entries(testImplementation.givens).reduce(
      (a, [key, g]) => {
        a[key] = (
          // name: string,
          features: string[],
          whens: BaseWhen<I>[],
          thens: BaseThen<I>[],
          gcb: I["given"],
          initialValues: any
        ) => {
          // Debug the parameters being passed - check if features contains when-like objects
          // console.log(`[Tiposkripto] Creating Given ${key} with:`);
          // console.log(`  name: ${name}`);
          // console.log(`  features:`, features);
          // console.log(`  whens:`, whens);
          // console.log(`  thens:`, thens);

          // Ensure parameters are arrays and create copies to avoid reference issues
          const safeFeatures = Array.isArray(features) ? [...features] : [];
          const safeWhens = Array.isArray(whens) ? [...whens] : [];
          const safeThens = Array.isArray(thens) ? [...thens] : [];

          return new (class extends BaseGiven<I> {
            // uberCatcher = uberCatcher;

            async givenThat(
              subject,
              testResource,
              // artifactory,
              initializer,
              initialValues
              // pm
            ) {
              return fullAdapter.beforeEach(
                subject,
                initializer,
                testResource,
                initialValues
                // pm
              );
            }

            afterEach(
              store: I["istore"],
              key: string
              // artifactory
              // pm
            ): Promise<unknown> {
              return Promise.resolve(fullAdapter.afterEach(store, key));
            }
          })(
            // name,
            safeFeatures,
            safeWhens,
            safeThens,
            testImplementation.givens[key],
            initialValues
          );
        };
        return a;
      },
      {}
    );

    const classyWhens = Object.entries(testImplementation.whens).reduce(
      (a, [key, whEn]: [string, (...x: any[]) => any]) => {
        a[key] = (...payload: any[]) => {
          const whenInstance = new (class extends BaseWhen<I> {
            async andWhen(store, whenCB, testResource) {
              return await fullAdapter.andWhen(store, whenCB, testResource);
            }
          })(`${key}: ${payload && payload.toString()}`, whEn(...payload));
          // console.log(`[Tiposkripto] Created When ${key}:`, whenInstance.name);
          return whenInstance;
        };
        return a;
      },
      {}
    );

    const classyThens = Object.entries(testImplementation.thens).reduce(
      (a, [key, thEn]: [string, (...x: any[]) => any]) => {
        a[key] = (...args: any[]) => {
          const thenInstance = new (class extends BaseThen<I> {
            async butThen(
              store: any,
              thenCB,
              testResource: any
              // pm: IPM
            ): Promise<I["iselection"]> {
              return await fullAdapter.butThen(store, thenCB, testResource);
            }
          })(`${key}: ${args && args.toString()}`, thEn(...args));
          // console.log(`[Tiposkripto] Created Then ${key}:`, thenInstance.name);
          return thenInstance;
        };
        return a;
      },
      {}
    );

    // Set up the overrides
    this.suitesOverrides = classySuites;
    this.givenOverides = classyGivens;
    this.whenOverides = classyWhens;
    this.thenOverides = classyThens;
    this.testResourceRequirement = testResourceRequirement;
    this.testSpecification = testSpecification;

    // Generate specs
    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then()
    );

    this.totalTests = this.calculateTotalTests();

    console.log("mark1");
    this.testJobs = this.specs.map((suite: BaseSuite<I, O>) => {
      console.log("mark2");
      const suiteRunner =
        (suite: BaseSuite<I, O>) => async (): Promise<BaseSuite<I, O>> => {
          try {
            console.log("mark3");
            const x = await suite.run(
              input
              // puppetMaster.testResourceConfiguration,
              // (fPath: string, value: string | Buffer | PassThrough) =>
              //   puppetMaster.testArtiFactoryfileWriter(
              //     tLog,
              //     (p: Promise<void>) => {
              //       this.artifacts.push(p);
              //     }
              //   )(
              //     puppetMaster.testResourceConfiguration.fs + "/" + fPath,
              //     value
              //   ),
              // tLog,
              // puppetMaster
            );
            console.log("mark3.5", x);
            return x;
          } catch (e) {
            console.error(e.stack);
            throw e;
          }
        };

      console.log("mark4");
      const runner = suiteRunner(suite);

      console.log("mark5", runner);
      return {
        test: suite,

        toObj: () => {
          return suite.toObj();
        },

        runner,

        receiveTestResourceConfig: async function (): Promise<IFinalResults> {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          // const tLog = async (...l: string[]) => {
          //   //
          // };

          console.log("mark7");

          try {
            const suiteDone: BaseSuite<I, O> = await runner();
            const fails = suiteDone.fails;

            console.log("mark6", this.toObj());

            await this.writeFileSync(
              `tests.json`,
              JSON.stringify(this.toObj(), null, 2),
              "test"
            );

            return {
              failed: fails > 0,
              fails,
              artifacts: this.artifacts || [],
              features: suiteDone.features(),
              tests: 0, // Keep existing field
              runTimeTests: this.totalTests, // Add the total number of tests
            };
          } catch (e) {
            console.error(e.stack);
            return {
              failed: true,
              fails: -1,
              artifacts: this.artifacts || [],
              features: [],
              tests: 0, // Keep existing field
              runTimeTests: -1, // Set to -1 on hard error
            };
          }
        },
      };
    });

    this.connectWebSocket(port, host);
  }

  // WebSocket methods
  protected async connectWebSocket(port: string, host?: string): Promise<void> {
    const wsHost = host || process.env.WS_HOST || "localhost";
    // const useTLS = process.env.WS_PROTOCOL === "ws" || false;
    const protocol = "ws";
    const url = `${protocol}://${wsHost}:${port}`;

    console.log(`[Tiposkripto] === WebSocket Connection Attempt ===`);
    console.log(`[Tiposkripto] Target URL: ${url}`);
    console.log(
      `[Tiposkripto] Protocol: ${protocol}, Host: ${wsHost}, Port: ${port}`
    );
    console.log(`[Tiposkripto] Current time: ${new Date().toISOString()}`);
    console.log(`[Tiposkripto] Process ID: ${process.pid}`);

    // First, let's check if we can even create a connection
    console.log(`[Tiposkripto] Creating WebSocket instance...`);

    return new Promise((resolve, reject) => {
      let timeoutFired = false;
      const timeout = setTimeout(() => {
        timeoutFired = true;
        console.log(
          `[Tiposkripto] ❌ WebSocket connection timeout after 10 seconds to ${url}`
        );
        console.log(`[Tiposkripto] This usually means:`);
        console.log(
          `[Tiposkripto]   1. No WebSocket server is running on port ${port}`
        );
        console.log(
          `[Tiposkripto]   2. The server is not accepting connections`
        );
        console.log(
          `[Tiposkripto]   3. There's a firewall blocking the connection`
        );
        console.log(
          `[Tiposkripto] Please ensure a WebSocket server is running on port ${port}`
        );
        reject(new Error(`WebSocket connection timeout to ${url}`));
      }, 10000);

      this.ws = new WebSocket(url);

      this.ws.on("open", () => {
        if (timeoutFired) return;
        clearTimeout(timeout);
        console.log(
          `[Tiposkripto] ✅ WebSocket connected successfully to ${url}`
        );
        console.log(`[Tiposkripto] Ready to send and receive messages`);
        resolve();
      });

      this.ws.on("error", (error) => {
        if (timeoutFired) return;
        clearTimeout(timeout);
        console.error(`[Tiposkripto] ❌ WebSocket connection error to ${url}:`);
        console.error(`[Tiposkripto] Error name: ${error.name}`);
        console.error(`[Tiposkripto] Error message: ${error.message}`);
        console.error(`[Tiposkripto] Error stack: ${error.stack}`);
        console.log(
          `[Tiposkripto] This usually means the WebSocket server is not running`
        );
        console.log(
          `[Tiposkripto] Check if something is listening on port ${port}`
        );
        reject(error);
      });

      this.ws.on("message", (data) => {
        const dataStr = data.toString();
        console.log(
          `[Tiposkripto] 📨 Received WebSocket message (${dataStr.length} chars)`
        );
        if (dataStr.length > 500) {
          console.log(
            `[Tiposkripto] Message preview: ${dataStr.substring(0, 500)}...`
          );
        } else {
          console.log(`[Tiposkripto] Message: ${dataStr}`);
        }
        try {
          const message = JSON.parse(dataStr);
          console.log(
            `[Tiposkripto] Parsed message type: ${message.type || "unknown"}`
          );
          if (message.key && this.messageCallbacks.has(message.key)) {
            const callback = this.messageCallbacks.get(message.key);
            if (callback) {
              callback(message.payload);
              this.messageCallbacks.delete(message.key);
            }
          }
        } catch (error) {
          console.error(
            `[Tiposkripto] Error parsing WebSocket message:`,
            error
          );
        }
      });

      this.ws.on("close", (code, reason) => {
        console.log(
          `[Tiposkripto] 🔌 WebSocket connection closed. Code: ${code}, Reason: ${reason.toString()}`
        );
      });
    });
  }

  protected sendCommand<I>(command: string, ...args: any[]): Promise<I> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("WebSocket is not connected"));
    }

    const key = Math.random().toString();

    return new Promise<I>((resolve, reject) => {
      // Store callback
      this.messageCallbacks.set(key, (payload) => {
        resolve(payload);
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        this.messageCallbacks.delete(key);
        reject(
          new Error(`Timeout waiting for response to command: ${command}`)
        );
      }, 10000);

      // Send message
      const message = {
        type: command,
        data: args.length > 0 ? args : undefined,
        key: key,
      };

      // Update callback to clear timeout
      const originalCallback = this.messageCallbacks.get(key);
      if (originalCallback) {
        this.messageCallbacks.set(key, (payload) => {
          clearTimeout(timeoutId);
          originalCallback(payload);
        });
      }

      this.ws!.send(JSON.stringify(message));
    });
  }

  protected closeWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async receiveTestResourceConfig(partialTestResource: string): Promise<any> {
    console.log("Tiposkripto.receiveTestResourceConfig - starting");

    // Parse the test resource configuration
    const testResource = JSON.parse(partialTestResource);
    console.log("Parsed test resource:", testResource);

    // Create a minimal puppetMaster object since PM is dead
    // The test job's receiveTestResourceConfig expects a puppetMaster with certain properties
    // const puppetMaster = {
    //   testResourceConfiguration: testResource,
    //   writeFileSync: async (
    //     filepath: string,
    //     contents: string
    //   ): Promise<boolean> => {
    //     // For now, just log
    //     console.log(`Would write to ${filepath}: ${contents.length} bytes`);
    //     return true;
    //   },
    //   // Add other required properties with dummy implementations
    //   testArtiFactoryfileWriter: () => {
    //     return () => {
    //       // Do nothing
    //     };
    //   },
    // } as any;

    // Call the test job's receiveTestResourceConfig with the puppetMaster
    return await this.testJobs[0].receiveTestResourceConfig();
  }

  Specs() {
    return this.specs;
  }
  Suites() {
    return this.suitesOverrides;
  }

  Given(): Record<
    keyof IExtenstions,
    (
      name: string,
      features: string[],
      whens: BaseWhen<I>[],
      thens: BaseThen<I>[],
      gcb: I["given"]
    ) => BaseGiven<I>
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof IExtenstions,
    (arg0: I["istore"], ...arg1: any) => BaseWhen<I>
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof IExtenstions,
    (selection: I["iselection"], expectation: any) => BaseThen<I>
  > {
    return this.thenOverides;
  }

  // Add a method to access test jobs which can be used by receiveTestResourceConfig
  getTestJobs(): ITestJob[] {
    return this.testJobs;
  }

  private calculateTotalTests(): number {
    let total = 0;
    for (const suite of this.specs) {
      if (suite && typeof suite === "object") {
        // Access the givens property which should be a record of test names to BaseGiven instances
        // The givens property is typically on the suite instance
        if ("givens" in suite) {
          const givens = (suite as any).givens;
          if (givens && typeof givens === "object") {
            total += Object.keys(givens).length;
          }
        }
      }
    }
    return total;
  }
}
