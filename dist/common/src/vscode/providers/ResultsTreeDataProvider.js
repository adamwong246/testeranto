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
exports.ResultsTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
const TestTreeItem_1 = require("../TestTreeItem");
const types_1 = require("../types");
class ResultsTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve(this.getResultItems());
        }
        return Promise.resolve([]);
    }
    getResultItems() {
        const results = [
            {
                label: "Calculator.test.ts - ✓ Passed",
                test: "Calculator.test.ts",
                status: "passed",
                icon: new vscode.ThemeIcon("check", new vscode.ThemeColor("testing.iconPassed"))
            },
            {
                label: "Calculator.pitono.test.py - ⏳ Running",
                test: "Calculator.pitono.test.py",
                status: "running",
                icon: new vscode.ThemeIcon("sync", new vscode.ThemeColor("testing.iconQueued"))
            },
            {
                label: "Calculator.golingvu.test.go - ✗ Failed",
                test: "Calculator.golingvu.test.go",
                status: "failed",
                icon: new vscode.ThemeIcon("error", new vscode.ThemeColor("testing.iconFailed"))
            },
            {
                label: "Calculator.test.ts (web) - ✓ Passed",
                test: "Calculator.test.ts (web)",
                status: "passed",
                icon: new vscode.ThemeIcon("check", new vscode.ThemeColor("testing.iconPassed"))
            }
        ];
        return results.map(result => new TestTreeItem_1.TestTreeItem(result.label, types_1.TreeItemType.Test, vscode.TreeItemCollapsibleState.None, { test: result.test, status: result.status }, undefined, result.icon));
    }
}
exports.ResultsTreeDataProvider = ResultsTreeDataProvider;
