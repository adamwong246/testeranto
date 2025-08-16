export const LOG_FILES = {
    TESTS: 'tests.json',
    TYPE_ERRORS: 'type_errors.txt',
    LINT_ERRORS: 'lint_errors.txt',
    EXIT: 'exit.log',
    MESSAGE: 'message.txt',
    PROMPT: 'prompt.txt',
    STDOUT: 'stdout.log',
    STDERR: 'stderr.log',
    INFO: 'info.log',
    ERROR: 'error.log',
    WARN: 'warn.log',
    DEBUG: 'debug.log'
};
export const STANDARD_LOGS = {
    TESTS: 'tests.json',
    TYPE_ERRORS: 'type_errors.txt',
    LINT_ERRORS: 'lint_errors.txt',
    EXIT: 'exit.log',
    MESSAGE: 'message.txt',
    PROMPT: 'prompt.txt'
};
export const RUNTIME_SPECIFIC_LOGS = {
    node: {
        STDOUT: 'stdout.log',
        STDERR: 'stderr.log'
    },
    web: {
        INFO: 'info.log',
        ERROR: 'error.log',
        WARN: 'warn.log',
        DEBUG: 'debug.log'
    },
    pure: {} // No runtime-specific logs for pure
};
export const ALL_LOGS = Object.assign(Object.assign({}, STANDARD_LOGS), Object.values(RUNTIME_SPECIFIC_LOGS).reduce((acc, logs) => (Object.assign(Object.assign({}, acc), logs)), {}));
export const getRuntimeLogs = (runtime) => {
    return {
        standard: Object.values(STANDARD_LOGS),
        runtimeSpecific: Object.values(RUNTIME_SPECIFIC_LOGS[runtime])
    };
};
export function getLogFilesForRuntime(runtime) {
    const { standard, runtimeSpecific } = getRuntimeLogs(runtime);
    return [...standard, ...runtimeSpecific];
}
