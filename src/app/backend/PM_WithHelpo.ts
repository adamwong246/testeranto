// /* eslint-disable @typescript-eslint/ban-ts-comment */
// /* eslint-disable no-async-promise-executor */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// /**
//  * PM_WithHelpo - Process Manager with Helpo Integration
//  *
//  * Helpo is a chat agent using aider that operates separately from other processes.
//  *
//  * How it works:
//  * 1. The server accepts chat messages from the frontend via WebSocket
//  * 2. Messages are added to a managed chat history file (FIFO data structure)
//  * 3. The managed history implements a rolling context window
//  * 4. Messages are passed to the helpo/aider Python process
//  * 5. Responses from helpo are also added to the managed history
//  * 6. Context is cleared after every exchange to maintain a rolling window
//  *
//  * The managed chat history ensures:
//  * - Recent conversation context is preserved within limits
//  * - Old messages are automatically pruned to prevent context overflow
//  * - Each exchange is self-contained within the rolling window
//  */

// import { IBuiltConfig } from "../../Types.js";
// import { spawnSync, ChildProcess } from "node:child_process";
// // @ts-ignore: node-pty is a CommonJS module
// import fs from "fs";
// import path from "path";
// // import { PM_1 } from "./PM_1_WithProcesses.js";
// import { PM_WithGit } from "./PM_WithGit.js";

// interface ChatMessage {
//   type: "user" | "assistant";
//   content: string;
//   timestamp: string;
// }

// export abstract class PM_WithHelpo extends PM_WithGit {
//   aiderProcess: ChildProcess | null = null;
//   chatHistoryPath: string;
//   MAX_HISTORY_SIZE = 10 * 1024; // 10KB
//   isAiderAtPrompt: boolean = false;

//   constructor(configs: IBuiltConfig, name, mode) {
//     super(configs, name, mode);
//     this.chatHistoryPath = path.join(
//       process.cwd(),
//       "testeranto",
//       "helpo_chat_history.json"
//     );
//     this.initializeChatHistory();
//     this.startAiderProcess();
//   }

//   private initializeChatHistory() {
//     // Always write an empty array to ensure valid JSON for chat history
//     fs.writeFileSync(this.chatHistoryPath, JSON.stringify([]));

//     // Ensure the message file exists and is empty
//     const messagePath = path.join(
//       process.cwd(),
//       "testeranto",
//       "helpo_chat_message.txt"
//     );
//     // Create the directory if it doesn't exist
//     const messageDir = path.dirname(messagePath);
//     if (!fs.existsSync(messageDir)) {
//       fs.mkdirSync(messageDir, { recursive: true });
//     }
//     // Create an empty message file
//     fs.writeFileSync(messagePath, "");
//   }

//   private startAiderProcess() {
//     // const promptPath = path.join(process.cwd(), "src", "helpo", "prompt.txt");
//     // try {
//     //   // Check if aider is available using spawnSync
//     //   const whichAider = spawnSync("which", ["aider"]);
//     //   if (whichAider.status !== 0) {
//     //     console.error(
//     //       "aider command not found. Please install aider: pip install aider-chat"
//     //     );
//     //     // Don't retry - just log the error and return
//     //     return;
//     //   }
//     //   // Use node-pty to spawn aider in a pseudoterminal to avoid "not a terminal" warnings
//     //   const ptyProcess = pty.spawn(
//     //     "aider",
//     //     ["--no-auto-commits", "--load", promptPath, "--edit-format", "ask"],
//     //     {
//     //       name: "xterm-color",
//     //       cols: 80,
//     //       rows: 30,
//     //       cwd: process.cwd(),
//     //       env: {
//     //         ...process.env,
//     //         TERM: "xterm-color",
//     //         FORCE_COLOR: "0",
//     //         NO_COLOR: "1",
//     //         PYTHONUNBUFFERED: "1",
//     //       },
//     //     }
//     //   );
//     //   // Store the pty process
//     //   const aiderProcess = ptyProcess as unknown as ChildProcess;
//     //   // Store the pty process
//     //   this.aiderProcess = ptyProcess as unknown as ChildProcess;
//     //   // Handle data from the pty process
//     //   ptyProcess.onData((data) => {
//     //     const output = data.toString();
//     //     // Clean the output by removing ANSI escape codes
//     //     const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
//     //     console.log(ansiColors.cyan(`🤖: ${cleanOutput}`));
//     //     // Check if the output indicates we're at the prompt
//     //     if (cleanOutput.includes('ask>')) {
//     //       this.isAiderAtPrompt = true;
//     //       console.log('Aider is at prompt');
//     //     }
//     //     // Check if the output contains our command
//     //     if (cleanOutput.includes('PROCESS_CHAT_HISTORY_AND_RESPOND')) {
//     //       console.log('Aider received our command');
//     //     }
//     //   });
//     //   // Handle process exit
//     //   ptyProcess.onExit(({ exitCode, signal }) => {
//     //     console.log(
//     //       `aider process exited with code ${exitCode}, signal ${signal}`
//     //     );
//     //     this.aiderProcess = null;
//     //     // Restart the process if it exits unexpectedly
//     //     if (exitCode !== 0) {
//     //       console.log("Restarting aider process...");
//     //       setTimeout(() => this.startAiderProcess(), 1000);
//     //     }
//     //   });
//     //   // Set up file watching for the message file
//     //   const messagePath = path.join(
//     //     process.cwd(),
//     //     "testeranto",
//     //     "helpo_chat_message.txt"
//     //   );
//     //   // Ensure the message file exists
//     //   if (!fs.existsSync(messagePath)) {
//     //     fs.writeFileSync(messagePath, "");
//     //   }
//     //   // Watch for changes to the message file
//     //   const watcher = fs.watch(messagePath, (eventType, filename) => {
//     //     console.log(`File ${filename} event: ${eventType}`);
//     //     if (eventType === 'change') {
//     //       // Add a small delay to ensure the file is fully written
//     //       setTimeout(() => {
//     //         fs.readFile(messagePath, 'utf8', (err, data) => {
//     //           if (err) {
//     //             // If the file doesn't exist, that's fine
//     //             if (err.code === 'ENOENT') {
//     //               return;
//     //             }
//     //             console.error('Error reading message file:', err);
//     //             return;
//     //           }
//     //           console.log(`Message file content: "${data}"`);
//     //           // Only process non-empty content
//     //           const trimmedData = data.trim();
//     //           if (trimmedData.length > 0) {
//     //             this.processAiderResponse(trimmedData);
//     //             // Clear the file
//     //             fs.writeFileSync(messagePath, "");
//     //           } else {
//     //             console.log('Ignoring empty message file change');
//     //           }
//     //         });
//     //       }, 100);
//     //     }
//     //   });
//     //   // Clean up watcher when process exits
//     //   aiderProcess.on('exit', () => {
//     //     watcher.close();
//     //   });
//     // } catch (e) {
//     //   console.error("Error starting aider process:", e);
//     //   // Don't exit, just log the error
//     // }
//   }

//   private async processAiderResponse(response: string) {
//     // Clean the response
//     const cleanResponse = response.trim();

//     // Ignore empty responses
//     if (!cleanResponse) {
//       return;
//     }

//     // Add the response to chat history
//     const assistantMessage: ChatMessage = {
//       type: "assistant",
//       content: cleanResponse,
//       timestamp: new Date().toISOString(),
//     };

//     await this.addToChatHistory(assistantMessage);

//     // Broadcast the updated chat history
//     const history = await this.getChatHistory();
//     this.webSocketBroadcastMessage({
//       type: "chatHistory",
//       messages: history,
//     });

//     // Trim the history to stay within size limits
//     await this.trimChatHistory();
//   }

//   private restartAiderProcess() {
//     if (this.aiderProcess) {
//       this.aiderProcess.kill();
//     }
//     this.startAiderProcess();
//   }

//   public isAiderAvailable(): boolean {
//     try {
//       const whichAider = spawnSync("which", ["aider"]);
//       return whichAider.status === 0;
//     } catch (error) {
//       return false;
//     }
//   }

//   private async addToChatHistory(message: ChatMessage): Promise<void> {
//     const history = await this.getChatHistory();
//     history.push(message);
//     fs.writeFileSync(this.chatHistoryPath, JSON.stringify(history, null, 2));
//     console.log(
//       `Added message to chat history: ${message.content.substring(0, 50)}...`
//     );
//   }

//   private async trimChatHistory(): Promise<void> {
//     const history = await this.getChatHistory();
//     let currentSize = Buffer.from(JSON.stringify(history)).length;

//     // Remove oldest messages until we're under the size limit
//     while (currentSize > this.MAX_HISTORY_SIZE && history.length > 0) {
//       history.shift(); // Remove oldest message
//       currentSize = Buffer.from(JSON.stringify(history)).length;
//     }

//     fs.writeFileSync(this.chatHistoryPath, JSON.stringify(history, null, 2));
//   }

//   public async getChatHistory(): Promise<ChatMessage[]> {
//     try {
//       const data = fs.readFileSync(this.chatHistoryPath, "utf-8");
//       return JSON.parse(data);
//     } catch (error) {
//       // If there's an error, return empty array
//       return [];
//     }
//   }

//   public async handleChatMessage(userMessage: string): Promise<void> {
//     // Add user message to chat history
//     const userChatMessage: ChatMessage = {
//       type: "user",
//       content: userMessage,
//       timestamp: new Date().toISOString(),
//     };

//     await this.addToChatHistory(userChatMessage);

//     // Broadcast the updated chat history
//     const history = await this.getChatHistory();
//     this.webSocketBroadcastMessage({
//       type: "chatHistory",
//       messages: history,
//     });

//     // Always record the message in the history file, even if aider is not available
//     console.log(`User message recorded: ${userMessage}`);

//     // If aider is not available, don't try to send messages to it
//     if (!this.aiderProcess) {
//       console.log(
//         "Aider process is not available - message recorded but not processed"
//       );
//       return;
//     }

//     // Send a direct command to process the chat history and respond
//     setTimeout(() => {
//       try {
//         if (this.aiderProcess) {
//           // Clear the message file
//           const messagePath = path.join(
//             process.cwd(),
//             "testeranto",
//             "helpo_chat_message.txt"
//           );
//           fs.writeFileSync(messagePath, "");

//           // For pty processes, we can write directly
//           // Cast to any to access the write method
//           const ptyProcess = this.aiderProcess as any;
//           // Send a direct command to read and respond
//           ptyProcess.write(
//             "PROCESS_CHAT_HISTORY_AND_RESPOND: Read the chat history and write your response ONLY to testeranto/helpo_chat_message.txt. Do NOT print to stdout.\n"
//           );
//         } else {
//           console.log("Aider process is not available");
//         }
//       } catch (error) {
//         console.error("Error writing to aider process:", error);
//       }
//     }, 100);
//   }

//   // // Override WebSocket message handling to include chat messages
//   // protected setupWebSocketHandlers() {
//   //   // This would be called from the parent class's WebSocket setup
//   //   // For now, we'll assume the parent class calls this
//   // }

//   // // This method should be called when a WebSocket message is received
//   // public handleWebSocketMessage(ws: any, message: any): void {
//   //   try {
//   //     const parsedMessage = JSON.parse(message.toString());

//   //     if (parsedMessage.type === "chatMessage") {
//   //       this.handleChatMessage(parsedMessage.content);
//   //     } else {
//   //       // Let parent class handle other message types
//   //       super.handleWebSocketMessage?.(ws, message);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error handling WebSocket message:", error);
//   //   }
//   // }
// }
