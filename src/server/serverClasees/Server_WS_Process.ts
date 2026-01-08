import fs from "fs";
import path from "path";
import { WebSocket } from "ws";
import { ITestResourceConfiguration } from "../../lib/tiposkripto";
import { IMode } from "../types";
import { Server_WS } from "./Server_WS";
import { WebSocketMessage } from "./utils/types";

export class Server_WS_Process extends Server_WS {
  private testInfoMap: Map<string, { testName: string; runtime: string }> =
    new Map();

  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);
  }

  protected handleWebSocketMessageTypes(
    wsm: WebSocketMessage,
    ws: WebSocket
  ): void {
    console.log(
      `[WebSocketProcess] Handling WebSocket message type: ${wsm.type}`
    );
    console.log(
      `[WebSocketProcess] Message data:`,
      JSON.stringify(wsm.data).substring(0, 200)
    );

    // First, let the base class handle its message types
    super.handleWebSocketMessageTypes(wsm, ws);

    // Then handle process-specific message types
    if (wsm.type === "getProcesses") {
      console.log(`[WebSocketProcess] Handling getProcesses request`);
      // Handle monitoring request for processes
      ws.send(
        JSON.stringify({
          type: "processes",
          data: this.getProcessSummary(),
          timestamp: new Date().toISOString(),
        })
      );
      console.log(`[WebSocketProcess] Sent processes data`);
    } else if (wsm.type === "getLogs") {
      // Handle monitoring request for logs
      const processId = wsm.data?.processId;

      if (processId) {
        ws.send(
          JSON.stringify({
            type: "logs",
            processId,
            logs: this.getProcessLogs(processId),
            timestamp: new Date().toISOString(),
          })
        );
      }
    } else if (wsm.type === "subscribeToLogs") {
      // Handle subscription to log updates
      const processId = wsm.data?.processId;

      if (processId) {
        // Store subscription info
        if (!(this as any).logSubscriptions) {
          (this as any).logSubscriptions = new Map();
        }
        const subscriptions =
          (this as any).logSubscriptions.get(processId) || new Set();
        subscriptions.add(ws);
        (this as any).logSubscriptions.set(processId, subscriptions);

        ws.send(
          JSON.stringify({
            type: "logSubscription",
            processId,
            status: "subscribed",
            timestamp: new Date().toISOString(),
          })
        );
      }
    } else if (wsm.type === "greeting") {
      // Handle test greeting - test is ready to be scheduled
      const testName = wsm.data?.testName;
      const runtime = wsm.data?.runtime;
      const testId = wsm.data?.testId;

      // Store WebSocket connection for this test
      if (!(this as any).testConnections) {
        (this as any).testConnections = new Map();
      }
      (this as any).testConnections.set(testId, ws);

      this.scheduleTestForExecution(testId, testName, runtime, ws);

      // Acknowledge greeting
      const ackMessage = {
        type: "greetingAck",
        testId,
        timestamp: new Date().toISOString(),
      };

      try {
        ws.send(JSON.stringify(ackMessage));
      } catch (error) {
        console.error(
          `[WebSocketProcess] Failed to send greeting acknowledgment for test ${testId}:`,
          error
        );
      }
    } else if (wsm.type === "testResult") {
      // Write test results to tests.json
      this.handleTestResult(wsm.data, ws);
    } else if (wsm.type === "testError") {
      // Handle test error from client

      // Write error to tests.json or error log
      this.handleTestError(wsm.data, ws);
    } else {
      console.log(
        `[WebSocketProcess] Unhandled WebSocket message type: ${wsm.type}`
      );
    }
  }

  getProcessSummary(): { processes: any[] } {
    // Return WebSocket connections as "processes"
    const processes = Array.from(this.clients).map((client, index) => {
      return {
        processId: `test-${index}`,
        command: "Test via WebSocket",
        status: "connected",
        timestamp: new Date().toISOString(),
      };
    });
    return { processes };
  }

  private getProcessLogs(processId: string): any[] {
    // No child process logs - return empty array
    return [];
  }

  // Method to broadcast logs to subscribed clients
  public broadcastLogs(processId: string, logEntry: any): void {
    // Broadcast to all clients interested in this process
    const message = JSON.stringify({
      type: "logs",
      processId,
      logs: [logEntry],
      timestamp: new Date().toISOString(),
    });

    this.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Schedule test for execution - to be overridden by subclasses
  protected scheduleTestForExecution(
    testId: string,
    testName: string,
    runtime: any,
    ws: WebSocket
  ): void {
    // Store test information for later use in result handling
    this.testInfoMap.set(testId, { testName, runtime });

    // Default implementation: send immediate test resource
    const testResourceConfiguration: ITestResourceConfiguration = {
      name: testName,
      fs: process.cwd(),
      ports: [3000],
      timeout: 30000,
      retries: 3,
      environment: {},
    };
    // Add browserWSEndpoint for web runtime
    if (runtime === "web") {
      testResourceConfiguration.browserWSEndpoint =
        process.env.BROWSER_WS_ENDPOINT || "";
    }

    const message = {
      type: "testResource",
      data: {
        testId,
        testName,
        runtime,
        allocatedAt: new Date().toISOString(),
        testResourceConfiguration,
      },
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(message));
  }

  // Handle test result from client
  private handleTestResult(testResultData: any, ws: WebSocket): void {
    try {
      // Find testId by looking up which test is associated with this WebSocket connection
      let testId: string | undefined;

      // Always find testId from testConnections map
      if ((this as any).testConnections) {
        for (const [id, connection] of (
          this as any
        ).testConnections.entries()) {
          if (connection === ws) {
            testId = id;
            break;
          }
        }
      }

      if (!testId) {
        throw new Error(
          "Could not find testId associated with WebSocket connection. The test must send a greeting before sending results."
        );
      }

      // Retrieve stored test information
      const testInfo = this.testInfoMap.get(testId);
      if (!testInfo) {
        throw new Error(
          `No stored test info found for testId: ${testId}. The test must send a greeting before sending results.`
        );
      }

      const { testName, runtime } = testInfo;
      console.log(
        `[WebSocketProcess] Retrieved stored test info for ${testId}:`,
        { testName, runtime }
      );

      this.handleTestResultWithInfo(
        testId,
        testName,
        runtime,
        testResultData,
        ws
      );
    } catch (error) {
      console.error(`[WebSocketProcess] Error handling test result:`, error);

      // Send error response to client
      const errorMessage = {
        type: "testResultError",
        timestamp: new Date().toISOString(),
        error: error.message,
      };
      ws.send(JSON.stringify(errorMessage));
    }
  }

  private handleTestResultWithInfo(
    testId: string,
    testName: string,
    runtime: string,
    testResultData: any,
    ws: WebSocket
  ): void {
    // Determine the report directory
    const reportDest = `testeranto/reports/${
      this.projectName || "default"
    }/${testName}/${runtime}`;

    // Ensure the directory exists
    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    // Write tests.json file
    const testsJsonPath = path.join(reportDest, "tests.json");
    const testsJsonContent = JSON.stringify(testResultData, null, 2);
    fs.writeFileSync(testsJsonPath, testsJsonContent);

    console.log(`[WebSocketProcess] Wrote test results to ${testsJsonPath}`);

    // Clean up stored test info
    this.testInfoMap.delete(testId);

    const ackMessage = {
      type: "testResultAck",
      testId,
      timestamp: new Date().toISOString(),
      message: "Test results saved successfully",
    };
    ws.send(JSON.stringify(ackMessage));
  }

  // Handle test error from client
  private handleTestError(testErrorData: any, ws: WebSocket): void {
    try {
      // Find testId by looking up which test is associated with this WebSocket connection
      let testId: string | undefined;

      // Always find testId from testConnections map
      if ((this as any).testConnections) {
        for (const [id, connection] of (
          this as any
        ).testConnections.entries()) {
          if (connection === ws) {
            testId = id;
            break;
          }
        }
      }

      if (!testId) {
        throw new Error(
          "Could not find testId associated with WebSocket connection. The test must send a greeting before sending errors."
        );
      }

      // Retrieve stored test information
      const testInfo = this.testInfoMap.get(testId);
      if (!testInfo) {
        throw new Error(
          `No stored test info found for testId: ${testId}. The test must send a greeting before sending errors.`
        );
      }

      const { testName, runtime } = testInfo;
      console.log(
        `[WebSocketProcess] Retrieved stored test info for ${testId}:`,
        { testName, runtime }
      );

      this.handleTestErrorWithInfo(
        testId,
        testName,
        runtime,
        testErrorData,
        ws
      );
    } catch (error) {
      console.error(`[WebSocketProcess] Error handling test error:`, error);

      // Send error response to client
      const errorMessage = {
        type: "testErrorError",
        timestamp: new Date().toISOString(),
        error: error.message,
      };
      ws.send(JSON.stringify(errorMessage));
    }
  }

  private handleTestErrorWithInfo(
    testId: string,
    testName: string,
    runtime: string,
    testErrorData: any,
    ws: WebSocket
  ): void {
    // Determine the report directory
    const reportDest = `testeranto/reports/${
      this.projectName || "default"
    }/${testName}/${runtime}`;

    // Ensure the directory exists
    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }

    // Write error.json file
    const errorJsonPath = path.join(reportDest, "error.json");
    const errorJsonContent = JSON.stringify(testErrorData, null, 2);
    fs.writeFileSync(errorJsonPath, errorJsonContent);

    // Clean up stored test info
    this.testInfoMap.delete(testId);

    // Send acknowledgment back to client
    const ackMessage = {
      type: "testErrorAck",
      testId,
      timestamp: new Date().toISOString(),
      message: "Test error saved successfully",
    };
    ws.send(JSON.stringify(ackMessage));
    console.log(
      `[WebSocketProcess] Sent test error acknowledgment for test ${testId}`
    );
  }
}
