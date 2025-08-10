export const NODE_LOG_FILES = ["stdout.log", "stderr.log", "exit.log"] as const;
export const WEB_LOG_FILES = [
  "info.log",
  "debug.log",
  "error.log",
  "warn.log",
  "exit.log",
] as const;
export const PURE_LOG_FILES = ["exit.log"] as const;

export type NodeLogFile = (typeof NODE_LOG_FILES)[number];
export type WebLogFile = (typeof WEB_LOG_FILES)[number];
export type PureLogFile = (typeof PURE_LOG_FILES)[number];

export const getLogFilesForRuntime = (runtime: string) => {
  switch (runtime) {
    case "node":
      return NODE_LOG_FILES;
    case "web":
      return WEB_LOG_FILES;
    case "pure":
      return PURE_LOG_FILES;
    default:
      throw new Error(`Unknown runtime: ${runtime}`);
  }
};
