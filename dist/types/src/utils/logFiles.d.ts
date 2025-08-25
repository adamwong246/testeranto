export type RuntimeName = 'node' | 'web' | 'pure';
export declare const LOG_FILES: {
    readonly TESTS: "tests.json";
    readonly TYPE_ERRORS: "type_errors.txt";
    readonly LINT_ERRORS: "lint_errors.txt";
    readonly EXIT: "exit.log";
    readonly MESSAGE: "message.txt";
    readonly PROMPT: "prompt.txt";
    readonly STDOUT: "stdout.log";
    readonly STDERR: "stderr.log";
    readonly INFO: "info.log";
    readonly ERROR: "error.log";
    readonly WARN: "warn.log";
    readonly DEBUG: "debug.log";
};
export declare const STANDARD_LOGS: {
    readonly TESTS: "tests.json";
    readonly TYPE_ERRORS: "type_errors.txt";
    readonly LINT_ERRORS: "lint_errors.txt";
    readonly EXIT: "exit.log";
    readonly MESSAGE: "message.txt";
    readonly PROMPT: "prompt.txt";
    readonly BUILD: "build.json";
};
export declare const RUNTIME_SPECIFIC_LOGS: {
    readonly node: {
        readonly STDOUT: "stdout.log";
        readonly STDERR: "stderr.log";
    };
    readonly web: {
        readonly INFO: "info.log";
        readonly ERROR: "error.log";
        readonly WARN: "warn.log";
        readonly DEBUG: "debug.log";
    };
    readonly pure: {};
};
export declare const ALL_LOGS: {
    readonly STDOUT: "stdout.log";
    readonly STDERR: "stderr.log";
    readonly TESTS: "tests.json";
    readonly TYPE_ERRORS: "type_errors.txt";
    readonly LINT_ERRORS: "lint_errors.txt";
    readonly EXIT: "exit.log";
    readonly MESSAGE: "message.txt";
    readonly PROMPT: "prompt.txt";
    readonly BUILD: "build.json";
} | {
    readonly INFO: "info.log";
    readonly ERROR: "error.log";
    readonly WARN: "warn.log";
    readonly DEBUG: "debug.log";
    readonly TESTS: "tests.json";
    readonly TYPE_ERRORS: "type_errors.txt";
    readonly LINT_ERRORS: "lint_errors.txt";
    readonly EXIT: "exit.log";
    readonly MESSAGE: "message.txt";
    readonly PROMPT: "prompt.txt";
    readonly BUILD: "build.json";
} | {
    readonly TESTS: "tests.json";
    readonly TYPE_ERRORS: "type_errors.txt";
    readonly LINT_ERRORS: "lint_errors.txt";
    readonly EXIT: "exit.log";
    readonly MESSAGE: "message.txt";
    readonly PROMPT: "prompt.txt";
    readonly BUILD: "build.json";
};
export declare const getRuntimeLogs: (runtime: RuntimeName) => {
    standard: ("tests.json" | "type_errors.txt" | "lint_errors.txt" | "prompt.txt" | "exit.log" | "message.txt" | "build.json")[];
    runtimeSpecific: ("stdout.log" | "stderr.log" | "info.log" | "error.log" | "warn.log" | "debug.log")[];
};
export type RuntimeLogs = typeof RUNTIME_SPECIFIC_LOGS;
export type LogFileType<T extends RuntimeName> = keyof RuntimeLogs[T];
export declare function getLogFilesForRuntime(runtime: RuntimeName): string[];
