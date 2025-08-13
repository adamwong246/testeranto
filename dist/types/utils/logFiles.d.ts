export declare const NODE_LOG_FILES: readonly ["stdout.log", "stderr.log", "exit.log"];
export declare const WEB_LOG_FILES: readonly ["info.log", "debug.log", "error.log", "warn.log", "exit.log"];
export declare const PURE_LOG_FILES: readonly ["exit.log"];
export type NodeLogFile = (typeof NODE_LOG_FILES)[number];
export type WebLogFile = (typeof WEB_LOG_FILES)[number];
export type PureLogFile = (typeof PURE_LOG_FILES)[number];
export declare const getLogFilesForRuntime: (runtime: string) => readonly ["stdout.log", "stderr.log", "exit.log"] | readonly ["info.log", "debug.log", "error.log", "warn.log", "exit.log"] | readonly ["exit.log"];
