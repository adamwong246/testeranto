import { ESLint } from "eslint";
import fs from "fs";
import path from "path";
import typescript from "typescript";
import { Analyzer } from "../src/tiposkripto/Analyzer";
import Tiposkripto from "../src/tiposkripto/Tiposkripto";
import { Calculator } from "./Calculator";
import { adapter } from "./Calculator.test.adapter";
import { implementation } from "./Calculator.test.implementation";
import { specification } from "./Calculator.test.specification";
import { I, M, O } from "./Calculator.test.types";

class TsAnalyzer extends Analyzer {
  async analyze(files: string[]): Promise<{
    eslint: {
      filePath: string;
      messages: any[];
      errorCount: number;
      warningCount: number;
      fixableErrorCount: number;
      fixableWarningCount: number;
    }[];
    typescript: {
      file: string | undefined;
      start: number | undefined;
      length: number | undefined;
      messageText: string;
      category: string;
      code: number;
    }[];
    summary: {
      totalFiles: number;
      analyzedFiles: number;
      errors: number;
      warnings: number;
    };
  }> {
    const results: {
      eslint: {
        filePath: string;
        messages: any[];
        errorCount: number;
        warningCount: number;
        fixableErrorCount: number;
        fixableWarningCount: number;
      }[];
      typescript: {
        file: string | undefined;
        start: number | undefined;
        length: number | undefined;
        messageText: string;
        category: string;
        code: number;
      }[];
      summary: {
        totalFiles: number;
        analyzedFiles: number;
        errors: number;
        warnings: number;
      };
    } = {
      eslint: [],
      typescript: [],
      summary: {
        totalFiles: files.length,
        analyzedFiles: 0,
        errors: 0,
        warnings: 0,
      },
    };

    // Filter for TypeScript/JavaScript files
    const tsJsFiles = files.filter(
      (f) =>
        f.endsWith(".ts") ||
        f.endsWith(".tsx") ||
        f.endsWith(".js") ||
        f.endsWith(".jsx")
    );

    if (tsJsFiles.length === 0) {
      throw "No TypeScript/JavaScript files found for analysis";
    }

    // Run ESLint if available
    try {
      const eslint = new ESLint({
        // useEslintrc: true,
        cwd: process.cwd(),
        fix: false,
      });

      const eslintResults = await eslint.lintFiles(tsJsFiles);
      results.eslint = eslintResults.map((result) => ({
        filePath: result.filePath,
        messages: result.messages,
        errorCount: result.errorCount,
        warningCount: result.warningCount,
        fixableErrorCount: result.fixableErrorCount,
        fixableWarningCount: result.fixableWarningCount,
      }));

      results.summary.errors += eslintResults.reduce(
        (sum, r) => sum + r.errorCount,
        0
      );
      results.summary.warnings += eslintResults.reduce(
        (sum, r) => sum + r.warningCount,
        0
      );
      results.summary.analyzedFiles += tsJsFiles.length;
    } catch (error: { message: string } | any) {
      console.warn("ESLint analysis failed:", error.message);
    }

    const tsConfigPath = path.join(process.cwd(), "tsconfig.json");
    if (
      fs.existsSync(tsConfigPath) &&
      tsJsFiles.some((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
    ) {
      try {
        const tsConfigFile = typescript.readConfigFile(tsConfigPath, (tsPath) =>
          fs.readFileSync(tsPath, "utf8")
        );

        if (tsConfigFile.error) {
          console.warn(
            "TypeScript config error:",
            tsConfigFile.error.messageText
          );
        } else {
          const tsProgram = typescript.createProgram(
            tsJsFiles,
            tsConfigFile.config
          );
          const tsResults = tsProgram
            .getSemanticDiagnostics()
            .concat(tsProgram.getSyntacticDiagnostics())
            .concat(tsProgram.getDeclarationDiagnostics());

          results.typescript = tsResults.map((diagnostic) => ({
            file: diagnostic.file?.fileName,
            start: diagnostic.start,
            length: diagnostic.length,
            messageText:
              typeof diagnostic.messageText === "string"
                ? diagnostic.messageText
                : diagnostic.messageText?.messageText,
            category:
              diagnostic.category === typescript.DiagnosticCategory.Error
                ? "error"
                : "warning",
            code: diagnostic.code,
          }));

          results.summary.errors += tsResults.filter(
            (d) => d.category === typescript.DiagnosticCategory.Error
          ).length;
          results.summary.warnings += tsResults.filter(
            (d) => d.category === typescript.DiagnosticCategory.Warning
          ).length;
        }
      } catch (error: { message: string } | any) {
        console.warn("TypeScript analysis failed:", error.message);
      }
    }

    console.log("Node.js static analysis completed");
    console.log(
      `Summary: ${results.summary.errors} errors, ${results.summary.warnings} warnings`
    );

    return results;
  }
}

export default Tiposkripto<I, O, M>(
  Calculator,
  specification,
  implementation,
  adapter,
  { ports: 1000 },
  new TsAnalyzer()
);
