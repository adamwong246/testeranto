/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IStrategy } from "../Types";

export type RuntimeCategory = "interpreted" | "compiled" | "VM" | "chrome";
export type RuntimeName =
  | "node"
  | "python"
  | "ruby"
  | "php"
  | "go"
  | "rust"
  | "java"
  | "web";

export interface RuntimeInfo {
  name: RuntimeName;
  category: RuntimeCategory;
  strategy: IStrategy;
  image: string;
  buildService: boolean;
  testService: boolean;
  processPool: boolean;
  sharedInstance: boolean;
}

export const RUNTIME_STRATEGIES: Record<RuntimeName, RuntimeInfo> = {
  // Interpreted languages
  node: {
    name: "node",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "node:20-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false,
  },
  python: {
    name: "python",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "python:3.11-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false,
  },
  ruby: {
    name: "ruby",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "ruby:3-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false,
  },
  php: {
    name: "php",
    category: "interpreted",
    strategy: "combined-build-test-process-pools",
    image: "php:8.2-alpine",
    buildService: true,
    testService: true,
    processPool: true,
    sharedInstance: false,
  },

  // Compiled languages
  go: {
    name: "go",
    category: "compiled",
    strategy: "separate-build-combined-test",
    image: "golang:1.21-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: false,
  },
  rust: {
    name: "rust",
    category: "compiled",
    strategy: "separate-build-combined-test",
    image: "rust:1.70-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: false,
  },

  // VM languages
  java: {
    name: "java",
    category: "VM",
    strategy: "combined-service-shared-jvm",
    image: "openjdk:17-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: true,
  },

  // Browser environment
  web: {
    name: "web",
    category: "chrome",
    strategy: "combined-service-shared-chrome",
    image: "node:20-alpine",
    buildService: true,
    testService: true,
    processPool: false,
    sharedInstance: true,
  },
};

export function getStrategyForRuntime(runtime: string): IStrategy {
  const runtimeName = runtime as RuntimeName;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].strategy;
  }
  // Default fallback
  return "combined-build-test-process-pools";
}

export function getCategoryForRuntime(runtime: string): RuntimeCategory {
  const runtimeName = runtime as RuntimeName;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].category;
  }
  // Default fallback
  return "interpreted";
}

export function shouldUseProcessPool(runtime: string): boolean {
  const runtimeName = runtime as RuntimeName;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].processPool;
  }
  return false;
}

export function shouldUseSharedInstance(runtime: string): boolean {
  const runtimeName = runtime as RuntimeName;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].sharedInstance;
  }
  return false;
}

export function getDefaultImage(runtime: string): string {
  const runtimeName = runtime as RuntimeName;
  if (RUNTIME_STRATEGIES[runtimeName]) {
    return RUNTIME_STRATEGIES[runtimeName].image;
  }
  return "alpine:latest";
}

export function getRuntimesByCategory(
  category: RuntimeCategory
): RuntimeName[] {
  return Object.values(RUNTIME_STRATEGIES)
    .filter((info) => info.category === category)
    .map((info) => info.name);
}

export function getRuntimesByStrategy(strategy: IStrategy): RuntimeName[] {
  return Object.values(RUNTIME_STRATEGIES)
    .filter((info) => info.strategy === strategy)
    .map((info) => info.name);
}
