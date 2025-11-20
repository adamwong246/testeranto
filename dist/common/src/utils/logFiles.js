"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntimeLogs = exports.ALL_LOGS = exports.RUNTIME_SPECIFIC_LOGS = exports.STANDARD_LOGS = exports.LOG_FILES = void 0;
exports.getLogFilesForRuntime = getLogFilesForRuntime;
exports.LOG_FILES = {
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
exports.STANDARD_LOGS = {
    TESTS: 'tests.json',
    TYPE_ERRORS: 'type_errors.txt',
    LINT_ERRORS: 'lint_errors.txt',
    EXIT: 'exit.log',
    MESSAGE: 'message.txt',
    PROMPT: 'prompt.txt',
    BUILD: 'build.json'
};
exports.RUNTIME_SPECIFIC_LOGS = {
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
    pure: {}, // No runtime-specific logs for pure
    python: {
        STDOUT: 'stdout.log',
        STDERR: 'stderr.log'
    },
    golang: {
        STDOUT: 'stdout.log',
        STDERR: 'stderr.log'
    }
};
exports.ALL_LOGS = Object.assign(Object.assign({}, exports.STANDARD_LOGS), Object.values(exports.RUNTIME_SPECIFIC_LOGS).reduce((acc, logs) => (Object.assign(Object.assign({}, acc), logs)), {}));
const getRuntimeLogs = (runtime) => {
    return {
        standard: Object.values(exports.STANDARD_LOGS),
        runtimeSpecific: Object.values(exports.RUNTIME_SPECIFIC_LOGS[runtime])
    };
};
exports.getRuntimeLogs = getRuntimeLogs;
function getLogFilesForRuntime(runtime) {
    const { standard, runtimeSpecific } = (0, exports.getRuntimeLogs)(runtime);
    return [...standard, ...runtimeSpecific];
}
