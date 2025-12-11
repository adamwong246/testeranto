/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IStrategy } from "../Types";

export type RuntimeCategory = "interpreted" | "compiled" | "VM" | "chrome";
export type RuntimeName = "node" | "python" | "ruby" | "php" | "go" | "rust" | "java" | "web";

export interface RuntimeInfo {
    name: RuntimeName;
    category: RuntimeCategory;
    processPoolType: 'lightweight' | 'binary' | 'shared-jvm' | 'shared-chrome';
    image: string;
    buildService: boolean;
    staticAnalysisService: boolean;
    processPoolService: boolean;
}

export const RUNTIME_STRATEGIES: Record<RuntimeName, RuntimeInfo> = {
    // Interpreted languages - use lightweight process pools
    node: {
        name: "node",
        category: "interpreted",
        processPoolType: "lightweight",
        image: "node:20-alpine",
        buildService: true,
        staticAnalysisService: true,
        processPoolService: true
    },
    python: {
        name: "python",
        category: "interpreted",
        processPoolType: "lightweight",
        image: "python:3.11-alpine",
        buildService: true,
        staticAnalysisService: true,
        processPoolService: true
    },
    ruby: {
        name: "ruby",
        category: "interpreted",
        processPoolType: "lightweight",
        image: "ruby:3-alpine",
        buildService: true,
        staticAnalysisService: true,
        processPoolService: true
    },
    php: {
        name: "php",
        category: "interpreted",
        processPoolType: "lightweight",
        image: "php:8.2-alpine",
        buildService: true,
        staticAnalysisService: true,
        processPoolService: true
    },
    
    // Compiled languages - use binary process pools
    go: {
        name: "go",
        category: "compiled",
        processPoolType: "binary",
        image: "golang:1.21-alpine",
        buildService: true,
        staticAnalysisService: true,
        processPoolService: true
    },
    rust: {
        name: "rust",
        category: "compiled",
        processPoolType: "binary",
        image: "rust:1.70-alpine",
        buildService: true,
        staticAnalysisService: true,
        processPoolService: true
    },
    
    // VM language - use shared JVM process pool
    java: {
        name: "java",
        category: "VM",
        processPoolType: "shared-jvm",
        image: "openjdk:17-alpine",
        buildService: true,
        staticAnalysisService: true,
        processPoolService: true
    },
    
    // Browser environment - use shared Chrome process pool
    web: {
        name: "web",
        category: "chrome",
        processPoolType: "shared-chrome",
        image: "node:20-alpine",
        buildService: true,
        staticAnalysisService: true,
        processPoolService: true
    }
};

export function getStrategyForRuntime(runtime: string): IStrategy {
    const runtimeName = runtime as RuntimeName;
    if (RUNTIME_STRATEGIES[runtimeName]) {
        // Map process pool type to legacy strategy for compatibility
        const processPoolType = RUNTIME_STRATEGIES[runtimeName].processPoolType;
        switch (processPoolType) {
            case 'lightweight':
            case 'binary':
                return 'combined-build-test-process-pools';
            case 'shared-jvm':
                return 'combined-service-shared-jvm';
            case 'shared-chrome':
                return 'combined-service-shared-chrome';
            default:
                return 'combined-build-test-process-pools';
        }
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
    // All runtimes use process pools in the new architecture
    const runtimeName = runtime as RuntimeName;
    if (RUNTIME_STRATEGIES[runtimeName]) {
        return RUNTIME_STRATEGIES[runtimeName].processPoolService;
    }
    return true; // Default to true in new architecture
}

export function shouldUseSharedInstance(runtime: string): boolean {
    const runtimeName = runtime as RuntimeName;
    if (RUNTIME_STRATEGIES[runtimeName]) {
        const processPoolType = RUNTIME_STRATEGIES[runtimeName].processPoolType;
        return processPoolType === 'shared-jvm' || processPoolType === 'shared-chrome';
    }
    return false;
}

export function getProcessPoolType(runtime: string): 'lightweight' | 'binary' | 'shared-jvm' | 'shared-chrome' {
    const runtimeName = runtime as RuntimeName;
    if (RUNTIME_STRATEGIES[runtimeName]) {
        return RUNTIME_STRATEGIES[runtimeName].processPoolType;
    }
    return 'lightweight'; // Default fallback
}

export function getDefaultImage(runtime: string): string {
    const runtimeName = runtime as RuntimeName;
    if (RUNTIME_STRATEGIES[runtimeName]) {
        return RUNTIME_STRATEGIES[runtimeName].image;
    }
    return "alpine:latest";
}

export function getRuntimesByCategory(category: RuntimeCategory): RuntimeName[] {
    return Object.values(RUNTIME_STRATEGIES)
        .filter(info => info.category === category)
        .map(info => info.name);
}

export function getRuntimesByStrategy(strategy: IStrategy): RuntimeName[] {
    return Object.values(RUNTIME_STRATEGIES)
        .filter(info => info.strategy === strategy)
        .map(info => info.name);
}
