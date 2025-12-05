/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateDockerEnvironment, validateDockerFile } from "./dockerCheck";

export class DockerValidator {
  static async validateDockerEnvironment(logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  }): Promise<{ composeCommand: string }> {
    return {
      composeCommand: validateDockerEnvironment(
        logger?.log || console.log,
        logger?.error || console.error
      ),
    };
  }

  static async validateComposeFile(
    composeFile: string,
    composeDir: string,
    composeCommand: string,
    logger?: {
      log: (...args: any[]) => void;
      error: (...args: any[]) => void;
      warn?: (...args: any[]) => void;
      info?: (...args: any[]) => void;
    }
  ): Promise<void> {
    validateDockerFile(
      logger?.log || console.log,
      logger?.error || console.error,
      composeCommand,
      composeFile,
      composeDir
    );
  }
}
