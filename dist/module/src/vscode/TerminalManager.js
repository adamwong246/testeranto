import * as vscode from 'vscode';
export class TerminalManager {
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
