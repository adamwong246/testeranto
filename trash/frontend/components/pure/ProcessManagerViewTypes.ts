export interface Process {
  processId: string;
  command: string;
  pid?: number;
  status?: "running" | "exited" | "error";
  exitCode?: number;
  error?: string;
  timestamp: string;
  logs?: string[];
}
