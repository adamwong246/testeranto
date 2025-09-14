/**
 * PM_WithHelpo - Process Manager with Helpo Integration
 *
 * Helpo is a chat agent using aider that operates separately from other processes.
 *
 * How it works:
 * 1. The server accepts chat messages from the frontend via WebSocket
 * 2. Messages are added to a managed chat history file (FIFO data structure)
 * 3. The managed history implements a rolling context window
 * 4. Messages are passed to the helpo/aider Python process
 * 5. Responses from helpo are also added to the managed history
 * 6. Context is cleared after every exchange to maintain a rolling window
 *
 * The managed chat history ensures:
 * - Recent conversation context is preserved within limits
 * - Old messages are automatically pruned to prevent context overflow
 * - Each exchange is self-contained within the rolling window
 */
import { PM_WithProcesses } from "./PM_WithProcesses.js";
import { IBuiltConfig } from "../Types.js";
import { ChildProcess } from "node:child_process";
interface ChatMessage {
    type: "user" | "assistant";
    content: string;
    timestamp: string;
}
export declare abstract class PM_WithHelpo extends PM_WithProcesses {
    aiderProcess: ChildProcess | null;
    chatHistoryPath: string;
    MAX_HISTORY_SIZE: number;
    isAiderAtPrompt: boolean;
    constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev");
    private initializeChatHistory;
    private startAiderProcess;
    private processAiderResponse;
    private restartAiderProcess;
    isAiderAvailable(): boolean;
    private addToChatHistory;
    private trimChatHistory;
    getChatHistory(): Promise<ChatMessage[]>;
    handleChatMessage(userMessage: string): Promise<void>;
    protected setupWebSocketHandlers(): void;
    handleWebSocketMessage(ws: any, message: any): void;
}
export {};
