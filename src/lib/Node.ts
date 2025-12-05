import {
  defaultTestResourceRequirement,
  ITTestResourceRequest,
} from "./index.js";
import { PM_Node } from "../PM/PM_Node.js";
import {
  ITestSpecification,
  ITestImplementation,
  ITestAdapter,
  Ibdd_in_any,
  Ibdd_out_any,
  Ibdd_out,
} from "../CoreTypes.js";
import Tiposkripto from "./Tiposkripto.js";

// let ipcfile;

export class NodeTiposkripto<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  M
> extends Tiposkripto<I, O, M> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M>,
    testResourceRequirement: ITTestResourceRequest,
    testAdapter: Partial<ITestAdapter<I>>
  ) {
    console.log("111 NodeTiposkripto constructor");
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      () => {
        // no-op
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async receiveTestResourceConfig() {
    // Always read test resource configuration from environment variable
    // The command line argument is no longer used with TCP
    const envTestResources = process.env.TEST_RESOURCES;
    if (!envTestResources) {
      throw new Error("TEST_RESOURCES environment variable must be set");
    }

    let testResourceConfig;
    try {
      testResourceConfig = JSON.parse(envTestResources);
    } catch (e) {
      console.error(
        "Error parsing test resource config from TEST_RESOURCES environment variable:",
        e
      );
      console.error("Received:", envTestResources);
      throw new Error(
        "Could not parse test resource configuration from TEST_RESOURCES"
      );
    }

    // Get DockerMan connection info from environment variables
    const dockerManHost = process.env.DOCKERMAN_HOST || "host.docker.internal";
    const dockerManPort = parseInt(process.env.DOCKERMAN_PORT || "0", 10);

    if (!dockerManPort) {
      throw new Error("DOCKERMAN_PORT environment variable must be set");
    }

    console.log(`🔌 Using DockerMan at ${dockerManHost}:${dockerManPort}`);
    console.log(
      `📋 Test resource configuration: ${JSON.stringify(
        testResourceConfig,
        null,
        2
      )}`
    );

    console.log("mark4", this.testJobs[0]);

    return await this.testJobs[0].receiveTestResourceConfig(
      new PM_Node(testResourceConfig, dockerManHost, dockerManPort)
    );
  }
}

const tiposkripto = async <I extends Ibdd_in_any, O extends Ibdd_out, M>(
  input: I["iinput"],
  testSpecification: ITestSpecification<I, O>,
  testImplementation: ITestImplementation<I, O, M>,
  testAdapter: Partial<ITestAdapter<I>>,
  testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement
): Promise<Tiposkripto<I, O, M>> => {
  try {
    const t = new NodeTiposkripto<I, O, M>(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter
    );

    console.log("mark3");

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      // Optionally, terminate the process or perform cleanup
      // t.registerUncaughtPromise(reason, promise);
    });

    // Test resource configuration is now in TEST_RESOURCES environment variable
    // DockerMan connection info is in DOCKERMAN_HOST and DOCKERMAN_PORT environment variables
    console.log("🔍 Starting Node test with environment variables:");
    console.log(
      `   TEST_RESOURCES: ${process.env.TEST_RESOURCES ? "Set" : "Not set"}`
    );
    console.log(
      `   DOCKERMAN_HOST: ${process.env.DOCKERMAN_HOST || "Not set"}`
    );
    console.log(
      `   DOCKERMAN_PORT: ${process.env.DOCKERMAN_PORT || "Not set"}`
    );

    const x = await t.receiveTestResourceConfig();
    console.log("mark5", x);

    process.exit(x.fails);
  } catch (e) {
    console.error(e);
    console.error(e.stack);
    process.exit(-1);
  }
};

export default tiposkripto;
