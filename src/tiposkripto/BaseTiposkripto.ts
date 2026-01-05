import { NonEmptyObject } from "type-fest";
import WebSocket from "ws";
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
  ITestResourceConfiguration,
  ITTestResourceRequest,
} from "./index.js";
import { Analyzer } from "./Analyzer";

type IExtenstions = Record<string, unknown>;

export default class BaseTiposkripto<
  I extends Ibdd_in_any = Ibdd_in_any,
  O extends Ibdd_out_any = Ibdd_out_any,
  M = unknown
> {
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  protected ws: WebSocket | null = null;

  totalTests: number = 0;
  artifacts: Promise<unknown>[] = [];
  assertThis: (t: I["then"]) => any;
  givenOverrides: Record<keyof IExtenstions, any>;
  specs: any;
  suitesOverrides: Record<keyof IExtenstions, any>;
  testJobs: ITestJob[];
  testResourceRequirement: ITTestResourceRequest;
  testSpecification: ITestSpecification<I, O>;
  thenOverrides: Record<keyof IExtenstions, any>;
  whenOverrides: Record<keyof IExtenstions, any>;

  analyzer: Analyzer;

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
    analyzer: Analyzer
  ) {
    this.analyzer = analyzer;

    const fullAdapter = DefaultAdapter<I>(testAdapter);

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
              tr: ITestResourceConfiguration
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
          features: string[],
          whens: BaseWhen<I>[],
          thens: BaseThen<I>[],
          gcb: I["given"],
          initialValues: any
        ) => {
          // WTF
          // Ensure parameters are arrays and create copies to avoid reference issues
          const safeFeatures = Array.isArray(features) ? [...features] : [];
          const safeWhens = Array.isArray(whens) ? [...whens] : [];
          const safeThens = Array.isArray(thens) ? [...thens] : [];

          return new (class extends BaseGiven<I> {
            async givenThat(subject, testResource, initializer, initialValues) {
              return fullAdapter.beforeEach(
                subject,
                initializer,
                testResource,
                initialValues
              );
            }

            afterEach(store: I["istore"], key: string): Promise<unknown> {
              return Promise.resolve(fullAdapter.afterEach(store, key));
            }
          })(
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
            ): Promise<I["iselection"]> {
              return await fullAdapter.butThen(store, thenCB, testResource);
            }
          })(`${key}: ${args && args.toString()}`, thEn(...args));

          return thenInstance;
        };
        return a;
      },
      {}
    );

    this.suitesOverrides = classySuites;
    this.givenOverides = classyGivens;
    this.whenOverides = classyWhens;
    this.thenOverides = classyThens;
    this.testResourceRequirement = testResourceRequirement;
    this.testSpecification = testSpecification;

    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then()
    );

    this.totalTests = this.calculateTotalTests();

    this.testJobs = this.specs.map((suite: BaseSuite<I, O>) => {
      const suiteRunner =
        (suite: BaseSuite<I, O>) =>
        async (
          testResourceConfiguration?: ITestResourceConfiguration
        ): Promise<BaseSuite<I, O>> => {
          try {
            const x = await suite.run(
              input,
              testResourceConfiguration || {
                name: suite.name,
                fs: process.cwd(),
                ports: [],
                timeout: 30000,
                retries: 3,
                environment: {},
              }
            );

            return x;
          } catch (e) {
            console.error(e.stack);
            throw e;
          }
        };

      const runner = suiteRunner(suite);

      const totalTests = this.totalTests;
      const testJob = {
        test: suite,

        toObj: () => {
          return suite.toObj();
        },

        runner,

        receiveTestResourceConfig: async (
          testResourceConfiguration: ITestResourceConfiguration
        ): Promise<IFinalResults> => {
          try {
            // Run the suite with the test resource configuration
            const suiteDone: BaseSuite<I, O> = await runner(
              testResourceConfiguration
            );
            const fails = suiteDone.fails;

            console.log(
              `Would write tests.json with:`,
              JSON.stringify(testJob.toObj(), null, 2)
            );

            return {
              failed: fails > 0,
              fails,
              artifacts: [], // this.artifacts is not accessible here
              features: suiteDone.features(),
              tests: 0,
              runTimeTests: totalTests,
            };
          } catch (e) {
            console.error(e.stack);
            return {
              failed: true,
              fails: -1,
              artifacts: [],
              features: [],
              tests: 0,
              runTimeTests: -1,
            };
          }
        },
      };
      return testJob;
    });

    this.connectWebSocket("3456", "localhost");
  }

  protected async connectWebSocket(port: string, host?: string): Promise<void> {
    const wsHost = host || process.env.WS_HOST || "localhost";
    const protocol = "ws";
    const url = `${protocol}://${wsHost}:${port}`;

    return new Promise((resolve, reject) => {
      let timeoutFired = false;
      const timeout = setTimeout(() => {
        timeoutFired = true;
        console.log(
          `[Tiposkripto] ❌ WebSocket connection timeout after 10 seconds to ${url}`
        );
        reject(new Error(`WebSocket connection timeout to ${url}`));
      }, 10000);

      this.ws = new WebSocket(url);

      this.ws.on("open", () => {
        if (timeoutFired) return;
        clearTimeout(timeout);

        // Send greeting message to server
        const greetingMessage = {
          type: "greeting",
          data: {
            testId: `test-${Date.now()}`,
            testName: "TiposkriptoTest",
            runtime: "node",
          },
        };
        this.ws.send(JSON.stringify(greetingMessage));

        resolve();
      });

      this.ws.on("error", (error) => {
        if (timeoutFired) return;
        clearTimeout(timeout);
        console.error(`[Tiposkripto] ❌ WebSocket connection error to ${url}:`);

        reject(error);
      });

      this.ws.on("message", (data) => {
        const dataStr = data.toString();
        try {
          const message = JSON.parse(dataStr);

          if (message.type === "testResource") {
            if (this.testJobs && this.testJobs.length > 0) {
              const testResourceConfig = message.data.testResourceConfiguration;
              this.testJobs[0]
                .receiveTestResourceConfig(testResourceConfig)
                .then((result) => {
                  // Send the result back to the server
                  if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    const resultMessage = {
                      type: "testResult",
                      data: result,
                      timestamp: new Date().toISOString(),
                    };
                    this.ws.send(JSON.stringify(resultMessage));
                    console.log(`[Tiposkripto] Sent test result to server`);
                  }
                })
                .catch((error) => {
                  console.error(`[Tiposkripto] Error executing test:`, error);

                  // Send error back to server
                  if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    const errorMessage = {
                      type: "testError",
                      data: { error: error.message },
                      timestamp: new Date().toISOString(),
                    };
                    this.ws.send(JSON.stringify(errorMessage));
                  }
                });
            } else {
              console.error(`[Tiposkripto] No test jobs available`);
            }
          }
          // Handle command responses
          else if (message.key && this.messageCallbacks.has(message.key)) {
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

      const timeoutId = setTimeout(() => {
        this.messageCallbacks.delete(key);
        reject(
          new Error(`Timeout waiting for response to command: ${command}`)
        );
      }, 10000);

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

  async receiveTestResourceConfig(
    testResourceConfig: ITestResourceConfiguration
  ): Promise<any> {
    if (this.testJobs && this.testJobs.length > 0) {
      // Run static analysis
      const analysisResult = this.analyzer.analyze(testResourceConfig.files);
      const analysis = analysisResult instanceof Promise ? await analysisResult : analysisResult;
      
      // Create a simple file path for the analysis results
      // Use a fixed location in the current directory
      const analysisDir = process.cwd();
      const analysisFileName = `analysis-${Date.now()}.json`;
      const analysisFilePath = `${analysisDir}/${analysisFileName}`;
      
      // Send to server via writeFileSync command
      // The server expects: filepath, contents, testName
      const testName = this.testJobs[0]?.test?.name || 'Test';
      const analysisString = JSON.stringify(analysis, null, 2);
      
      try {
        await this.sendCommand("writeFileSync", analysisFilePath, analysisString, testName);
        console.log(`[Tiposkripto] Analysis results sent to server`);
      } catch (error) {
        console.error(`[Tiposkripto] Error sending analysis:`, error.message);
      }

      // Continue with the test
      return this.testJobs[0].receiveTestResourceConfig(testResourceConfig);
    } else {
      throw new Error("No test jobs available");
    }
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
    return this.givenOverrides;
  }

  When(): Record<
    keyof IExtenstions,
    (arg0: I["istore"], ...arg1: any) => BaseWhen<I>
  > {
    return this.whenOverrides;
  }

  Then(): Record<
    keyof IExtenstions,
    (selection: I["iselection"], expectation: any) => BaseThen<I>
  > {
    return this.thenOverrides;
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
