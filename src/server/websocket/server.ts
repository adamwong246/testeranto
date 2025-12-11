/* eslint-disable @typescript-eslint/no-explicit-any */
import WebSocket from "ws";
import { BrowserContextManager } from "./browserContextManager.js";

const manager = new BrowserContextManager();

// Use port from environment or default to 8080
const WS_PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080;
const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`WebSocket server started on port ${WS_PORT}`);

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      const { type, key, data: args = [] } = data;

      let result: any;

      // Handle browser context commands
      switch (type) {
        case "createBrowserContext":
          result = await manager.createBrowserContext();
          break;
        case "disposeBrowserContext":
          await manager.disposeBrowserContext(args[0]);
          result = null;
          break;
        case "getBrowserContexts":
          result = await manager.getBrowserContexts();
          break;
        case "newPageInContext":
          result = await manager.newPageInContext(args[0]);
          break;
        case "getBrowserMemoryUsage":
          result = await manager.getBrowserMemoryUsage();
          break;
        case "cleanupContext":
          await manager.cleanupContext(args[0]);
          result = null;
          break;
        // Handle existing PM_Web commands by forwarding to browser contexts
        // For now, we need to implement basic compatibility
        case "newPage":
          // Create a default context and page
          try {
            const contextId = await manager.createBrowserContext();
            const pageId = await manager.newPageInContext(contextId);
            result = { pageId, contextId };
            console.log("Created new page in context:", contextId, pageId);
          } catch (error) {
            console.error("Error creating new page:", error);
            throw error;
          }
          break;
        case "pages":
          // Return all pages from all contexts
          result = [];
          break;
        case "closePage":
          // We need to track page-context mapping, but for now just acknowledge
          result = true;
          break;
        case "goto":
        case "$":
        case "click":
        case "waitForSelector":
        case "getAttribute":
        case "getInnerHtml":
        case "focusOn":
        case "typeInto":
        case "isDisabled":
        case "screencast":
        case "screencastStop":
        case "customScreenShot":
        case "existsSync":
        case "mkdirSync":
        case "write":
        case "writeFileSync":
        case "createWriteStream":
        case "end":
        case "customclose":
        case "page":
          // For compatibility, return null or appropriate values
          console.log(`Handling command: ${type}`);
          result = null;
          break;
        default:
          console.log(`Unknown command type: ${type}`);
          result = null;
      }

      ws.send(JSON.stringify({ key, payload: result }));
    } catch (error) {
      console.error("Error handling message:", error);
      ws.send(
        JSON.stringify({
          key: data?.key,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Cleanup on shutdown
process.on("SIGINT", async () => {
  await manager.shutdown();
  wss.close();
  process.exit(0);
});
