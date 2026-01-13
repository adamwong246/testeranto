import * as vscode from 'vscode';
import { IRunTime } from '../Types';

export class TerminalManager {
  private terminals: Map<string, vscode.Terminal> = new Map();

  getTerminalKey(runtime: string, testName: string): string {
    return `${runtime}:${testName}`;
  }

  createTerminal(runtime: string, testName: string): vscode.Terminal {
    const key = this.getTerminalKey(runtime, testName);
    const terminal = vscode.window.createTerminal(`Testeranto: ${testName} (${runtime})`);
    this.terminals.set(key, terminal);
    return terminal;
  }

  getTerminal(runtime: string, testName: string): vscode.Terminal | undefined {
    const key = this.getTerminalKey(runtime, testName);
    return this.terminals.get(key);
  }

  showTerminal(runtime: string, testName: string): vscode.Terminal | undefined {
    const terminal = this.getTerminal(runtime, testName);
    if (terminal) {
      terminal.show();
    }
    return terminal;
  }

  sendTextToTerminal(runtime: string, testName: string, text: string): void {
    const terminal = this.getTerminal(runtime, testName);
    if (terminal) {
      terminal.sendText(text);
    }
  }

  disposeTerminal(runtime: string, testName: string): void {
    const key = this.getTerminalKey(runtime, testName);
    const terminal = this.terminals.get(key);
    if (terminal) {
      terminal.dispose();
      this.terminals.delete(key);
    }
  }

  disposeAll(): void {
    for (const terminal of this.terminals.values()) {
      terminal.dispose();
    }
    this.terminals.clear();
  }

  getAllTestConfigs(): { runtime: string, testName: string }[] {
    const configs = [];
    const runtimes = ["node", "web", "python", "golang"];

    for (const runtime of runtimes) {
      let testNames: string[] = [];
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

  createAiderTerminal(runtime: IRunTime, testName: string): vscode.Terminal {
    const key = this.getTerminalKey(runtime, testName);
    let terminal = this.terminals.get(key);
    if (terminal && terminal.exitStatus === undefined) {
      return terminal;
    }
    terminal = vscode.window.createTerminal(`Aider: ${testName} (${runtime})`);
    this.terminals.set(key, terminal);
    return terminal;
  }

  createAllTerminals(): void {
    const configs = this.getAllTestConfigs();
    for (const { runtime, testName } of configs) {
      try {
        this.createTerminal(runtime, testName);
      } catch (error) {
        console.error(`Failed to create terminal for ${testName} (${runtime}):`, error);
      }
    }
  }
}