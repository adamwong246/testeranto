"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalManager = void 0;
const vscode = __importStar(require("vscode"));
class TerminalManager {
    constructor() {
        this.terminals = new Map();
    }
    getTerminalKey(runtime, testName) {
        return `${runtime}:${testName}`;
    }
    createTerminal(runtime, testName) {
        const key = this.getTerminalKey(runtime, testName);
        const terminal = vscode.window.createTerminal(`Testeranto: ${testName} (${runtime})`);
        this.terminals.set(key, terminal);
        return terminal;
    }
    getTerminal(runtime, testName) {
        const key = this.getTerminalKey(runtime, testName);
        return this.terminals.get(key);
    }
    showTerminal(runtime, testName) {
        const terminal = this.getTerminal(runtime, testName);
        if (terminal) {
            terminal.show();
        }
        return terminal;
    }
    sendTextToTerminal(runtime, testName, text) {
        const terminal = this.getTerminal(runtime, testName);
        if (terminal) {
            terminal.sendText(text);
        }
    }
    disposeTerminal(runtime, testName) {
        const key = this.getTerminalKey(runtime, testName);
        const terminal = this.terminals.get(key);
        if (terminal) {
            terminal.dispose();
            this.terminals.delete(key);
        }
    }
    disposeAll() {
        for (const terminal of this.terminals.values()) {
            terminal.dispose();
        }
        this.terminals.clear();
    }
    getAllTestConfigs() {
        const configs = [];
        const runtimes = ["node", "web", "python", "golang"];
        for (const runtime of runtimes) {
            let testNames = [];
            switch (runtime) {
                case "node":
                    testNames = ["Calculator.test.ts"];
                    break;
                case "web":
                    testNames = ["Calculator.test.ts"];
                    break;
                case "python":
                    testNames = ["Calculator.pitono.test.py"];
                    break;
                case "golang":
                    testNames = ["Calculator.golingvu.test.go"];
                    break;
            }
            for (const testName of testNames) {
                configs.push({ runtime, testName });
            }
        }
        return configs;
    }
    createAiderTerminal(runtime, testName) {
        const key = this.getTerminalKey(runtime, testName);
        let terminal = this.terminals.get(key);
        if (terminal && terminal.exitStatus === undefined) {
            return terminal;
        }
        terminal = vscode.window.createTerminal(`Aider: ${testName} (${runtime})`);
        this.terminals.set(key, terminal);
        return terminal;
    }
    createAllTerminals() {
        const configs = this.getAllTestConfigs();
        for (const { runtime, testName } of configs) {
            try {
                this.createTerminal(runtime, testName);
            }
            catch (error) {
                console.error(`Failed to create terminal for ${testName} (${runtime}):`, error);
            }
        }
    }
}
exports.TerminalManager = TerminalManager;
