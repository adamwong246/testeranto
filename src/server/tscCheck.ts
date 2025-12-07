/* eslint-disable @typescript-eslint/no-explicit-any */
import ts from "typescript";
import { IRunTime } from "../Types";
import { tscPather } from "./utils";
import tsc from "tsc-prog";

export const tscCheck = ({
  entrypoint,
  addableFiles,
  platform,
  projectName,
}: {
  entrypoint: string;
  addableFiles: string[];
  platform: IRunTime;
  projectName: string;
}) => {
  const program = tsc.createProgramFromConfig({
    basePath: process.cwd(),
    configFilePath: "tsconfig.json",
    compilerOptions: {
      outDir: tscPather(entrypoint, platform, projectName),
      noEmit: true,
    },
    include: addableFiles,
  });

  const allDiagnostics = program.getSemanticDiagnostics();

  const results: string[] = [];
  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      results.push(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      results.push(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });

  return results;
};
