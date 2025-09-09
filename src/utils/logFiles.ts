export type RuntimeName = 'node' | 'web' | 'pure' | 'python' | 'golang';

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
} as const;

export const STANDARD_LOGS = {
  TESTS: 'tests.json',
  TYPE_ERRORS: 'type_errors.txt',
  LINT_ERRORS: 'lint_errors.txt',
  EXIT: 'exit.log',
  MESSAGE: 'message.txt',
  PROMPT: 'prompt.txt',
  BUILD: 'build.json'
} as const;

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
  pure: {}, // No runtime-specific logs for pure
  python: {
    STDOUT: 'stdout.log',
    STDERR: 'stderr.log'
  },
  golang: {
    STDOUT: 'stdout.log',
    STDERR: 'stderr.log'
  }
} as const;

export const ALL_LOGS = {
  ...STANDARD_LOGS,
  ...Object.values(RUNTIME_SPECIFIC_LOGS).reduce((acc, logs) => 
    ({...acc, ...logs}), {})
} as const;

export const getRuntimeLogs = (runtime: RuntimeName) => {
  return {
    standard: Object.values(STANDARD_LOGS),
    runtimeSpecific: Object.values(RUNTIME_SPECIFIC_LOGS[runtime])
  };
};

export type RuntimeLogs = typeof RUNTIME_SPECIFIC_LOGS;
export type LogFileType<T extends RuntimeName> = keyof RuntimeLogs[T];

export function getLogFilesForRuntime(runtime: RuntimeName): string[] {
  const { standard, runtimeSpecific } = getRuntimeLogs(runtime);
  return [...standard, ...runtimeSpecific];
}
