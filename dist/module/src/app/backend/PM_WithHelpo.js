/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { spawnSync } from "node:child_process";
// @ts-ignore: node-pty is a CommonJS module
import fs from "fs";
import path from "path";
import { PM_WithGit } from "./PM_WithGit.js";
export class PM_WithHelpo extends PM_WithGit {
    constructor(configs, name, mode) {
        super(configs, name, mode);
        this.aiderProcess = null;
        this.MAX_HISTORY_SIZE = 10 * 1024; // 10KB
        this.isAiderAtPrompt = false;
        this.chatHistoryPath = path.join(process.cwd(), "testeranto", "helpo_chat_history.json");
        this.initializeChatHistory();
        this.startAiderProcess();
    }
    initializeChatHistory() {
        // Always write an empty array to ensure valid JSON for chat history
        fs.writeFileSync(this.chatHistoryPath, JSON.stringify([]));
        // Ensure the message file exists and is empty
        const messagePath = path.join(process.cwd(), "testeranto", "helpo_chat_message.txt");
        // Create the directory if it doesn't exist
        const messageDir = path.dirname(messagePath);
        if (!fs.existsSync(messageDir)) {
            fs.mkdirSync(messageDir, { recursive: true });
        }
        // Create an empty message file
        fs.writeFileSync(messagePath, "");
    }
    startAiderProcess() {
        // const promptPath = path.join(process.cwd(), "src", "helpo", "prompt.txt");
        // try {
        //   // Check if aider is available using spawnSync
        //   const whichAider = spawnSync("which", ["aider"]);
        //   if (whichAider.status !== 0) {
        //     console.error(
        //       "aider command not found. Please install aider: pip install aider-chat"
        //     );
        //     // Don't retry - just log the error and return
        //     return;
        //   }
        //   // Use node-pty to spawn aider in a pseudoterminal to avoid "not a terminal" warnings
        //   const ptyProcess = pty.spawn(
        //     "aider",
        //     ["--no-auto-commits", "--load", promptPath, "--edit-format", "ask"],
        //     {
        //       name: "xterm-color",
        //       cols: 80,
        //       rows: 30,
        //       cwd: process.cwd(),
        //       env: {
        //         ...process.env,
        //         TERM: "xterm-color",
        //         FORCE_COLOR: "0",
        //         NO_COLOR: "1",
        //         PYTHONUNBUFFERED: "1",
        //       },
        //     }
        //   );
        //   // Store the pty process
        //   const aiderProcess = ptyProcess as unknown as ChildProcess;
        //   // Store the pty process
        //   this.aiderProcess = ptyProcess as unknown as ChildProcess;
        //   // Handle data from the pty process
        //   ptyProcess.onData((data) => {
        //     const output = data.toString();
        //     // Clean the output by removing ANSI escape codes
        //     const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
        //     console.log(ansiColors.cyan(`🤖: ${cleanOutput}`));
        //     // Check if the output indicates we're at the prompt
        //     if (cleanOutput.includes('ask>')) {
        //       this.isAiderAtPrompt = true;
        //       console.log('Aider is at prompt');
        //     }
        //     // Check if the output contains our command
        //     if (cleanOutput.includes('PROCESS_CHAT_HISTORY_AND_RESPOND')) {
        //       console.log('Aider received our command');
        //     }
        //   });
        //   // Handle process exit
        //   ptyProcess.onExit(({ exitCode, signal }) => {
        //     console.log(
        //       `aider process exited with code ${exitCode}, signal ${signal}`
        //     );
        //     this.aiderProcess = null;
        //     // Restart the process if it exits unexpectedly
        //     if (exitCode !== 0) {
        //       console.log("Restarting aider process...");
        //       setTimeout(() => this.startAiderProcess(), 1000);
        //     }
        //   });
        //   // Set up file watching for the message file
        //   const messagePath = path.join(
        //     process.cwd(),
        //     "testeranto",
        //     "helpo_chat_message.txt"
        //   );
        //   // Ensure the message file exists
        //   if (!fs.existsSync(messagePath)) {
        //     fs.writeFileSync(messagePath, "");
        //   }
        //   // Watch for changes to the message file
        //   const watcher = fs.watch(messagePath, (eventType, filename) => {
        //     console.log(`File ${filename} event: ${eventType}`);
        //     if (eventType === 'change') {
        //       // Add a small delay to ensure the file is fully written
        //       setTimeout(() => {
        //         fs.readFile(messagePath, 'utf8', (err, data) => {
        //           if (err) {
        //             // If the file doesn't exist, that's fine
        //             if (err.code === 'ENOENT') {
        //               return;
        //             }
        //             console.error('Error reading message file:', err);
        //             return;
        //           }
        //           console.log(`Message file content: "${data}"`);
        //           // Only process non-empty content
        //           const trimmedData = data.trim();
        //           if (trimmedData.length > 0) {
        //             this.processAiderResponse(trimmedData);
        //             // Clear the file
        //             fs.writeFileSync(messagePath, "");
        //           } else {
        //             console.log('Ignoring empty message file change');
        //           }
        //         });
        //       }, 100);
        //     }
        //   });
        //   // Clean up watcher when process exits
        //   aiderProcess.on('exit', () => {
        //     watcher.close();
        //   });
        // } catch (e) {
        //   console.error("Error starting aider process:", e);
        //   // Don't exit, just log the error
        // }
    }
    async processAiderResponse(response) {
        // Clean the response
        const cleanResponse = response.trim();
        // Ignore empty responses
        if (!cleanResponse) {
            return;
        }
        // Add the response to chat history
        const assistantMessage = {
            type: "assistant",
            content: cleanResponse,
            timestamp: new Date().toISOString(),
        };
        await this.addToChatHistory(assistantMessage);
        // Broadcast the updated chat history
        const history = await this.getChatHistory();
        this.webSocketBroadcastMessage({
            type: "chatHistory",
            messages: history,
        });
        // Trim the history to stay within size limits
        await this.trimChatHistory();
    }
    restartAiderProcess() {
        if (this.aiderProcess) {
            this.aiderProcess.kill();
        }
        this.startAiderProcess();
    }
    isAiderAvailable() {
        try {
            const whichAider = spawnSync("which", ["aider"]);
            return whichAider.status === 0;
        }
        catch (error) {
            return false;
        }
    }
    async addToChatHistory(message) {
        const history = await this.getChatHistory();
        history.push(message);
        fs.writeFileSync(this.chatHistoryPath, JSON.stringify(history, null, 2));
        console.log(`Added message to chat history: ${message.content.substring(0, 50)}...`);
    }
    async trimChatHistory() {
        const history = await this.getChatHistory();
        let currentSize = Buffer.from(JSON.stringify(history)).length;
        // Remove oldest messages until we're under the size limit
        while (currentSize > this.MAX_HISTORY_SIZE && history.length > 0) {
            history.shift(); // Remove oldest message
            currentSize = Buffer.from(JSON.stringify(history)).length;
        }
        fs.writeFileSync(this.chatHistoryPath, JSON.stringify(history, null, 2));
    }
    async getChatHistory() {
        try {
            const data = fs.readFileSync(this.chatHistoryPath, "utf-8");
            return JSON.parse(data);
        }
        catch (error) {
            // If there's an error, return empty array
            return [];
        }
    }
    async handleChatMessage(userMessage) {
        // Add user message to chat history
        const userChatMessage = {
            type: "user",
            content: userMessage,
            timestamp: new Date().toISOString(),
        };
        await this.addToChatHistory(userChatMessage);
        // Broadcast the updated chat history
        const history = await this.getChatHistory();
        this.webSocketBroadcastMessage({
            type: "chatHistory",
            messages: history,
        });
        // Always record the message in the history file, even if aider is not available
        console.log(`User message recorded: ${userMessage}`);
        // If aider is not available, don't try to send messages to it
        if (!this.aiderProcess) {
            console.log("Aider process is not available - message recorded but not processed");
            return;
        }
        // Send a direct command to process the chat history and respond
        setTimeout(() => {
            try {
                if (this.aiderProcess) {
                    // Clear the message file
                    const messagePath = path.join(process.cwd(), "testeranto", "helpo_chat_message.txt");
                    fs.writeFileSync(messagePath, "");
                    // For pty processes, we can write directly
                    // Cast to any to access the write method
                    const ptyProcess = this.aiderProcess;
                    // Send a direct command to read and respond
                    ptyProcess.write("PROCESS_CHAT_HISTORY_AND_RESPOND: Read the chat history and write your response ONLY to testeranto/helpo_chat_message.txt. Do NOT print to stdout.\n");
                }
                else {
                    console.log("Aider process is not available");
                }
            }
            catch (error) {
                console.error("Error writing to aider process:", error);
            }
        }, 100);
    }
}
