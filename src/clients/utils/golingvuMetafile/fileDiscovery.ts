/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
// import { runGoList } from "../golingvuMetafile/goList";

// export function findGoFilesInProject(): string[] {
//   // Use go list to find all Go files in the current module
//   // const packages = runGoList("./...");
//   const goFiles: string[] = [];

//   for (const pkg of packages) {
//     // Include all Go files including test files
//     const fileTypes = [
//       "GoFiles",
//       "CgoFiles",
//       "IgnoredGoFiles",
//       "TestGoFiles",
//       "XTestGoFiles",
//     ];

//     for (const fileType of fileTypes) {
//       const files = (pkg as any)[fileType];
//       if (files) {
//         for (const file of files) {
//           // Only include files with .go extension
//           if (file.endsWith(".go")) {
//             goFiles.push(path.join(pkg.Dir, file));
//           }
//         }
//       }
//     }
//   }

//   // Filter out any non-.go files that might have slipped through
//   return goFiles.filter((file) => file.endsWith(".go"));
// }

export function collectGoDependencies(
  filePath: string,
  visited: Set<string> = new Set()
): string[] {
  // Only process .go files
  if (!filePath.endsWith(".go")) {
    return [];
  }

  if (visited.has(filePath)) return [];
  visited.add(filePath);

  const dependencies: string[] = [filePath];

  // Find the package this file belongs to by looking at the directory
  const dir = path.dirname(filePath);

  // Always include other .go files in the same directory
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith(".go") && file !== path.basename(filePath)) {
        const fullPath = path.join(dir, file);
        dependencies.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Could not read directory ${dir}:`, error);
  }

  // Parse imports from the file content to find local imports
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const importRegex = /import\s*(?:\(\s*([\s\S]*?)\s*\)|"([^"]+)")/g;

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      if (match[2]) {
        // Single import
        const importPath = match[2].trim();
        processImport(importPath, dir, dependencies, visited);
      } else if (match[1]) {
        // Multi-line imports in parentheses
        const importBlock = match[1];
        const importLines = importBlock
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0 && !line.startsWith("//"));

        for (const line of importLines) {
          const lineMatch = line.match(/"([^"]+)"/);
          if (lineMatch) {
            const importPath = lineMatch[1].trim();
            processImport(importPath, dir, dependencies, visited);
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Could not read file ${filePath} for import parsing:`, error);
  }

  return [...new Set(dependencies)];
}

function processImport(
  importPath: string,
  currentDir: string,
  dependencies: string[],
  visited: Set<string>
) {
  // Check if it's a standard library import (no dots in first path element)
  const firstPathElement = importPath.split("/")[0];
  const isExternal = firstPathElement.includes(".");

  // If it's not external, it's either standard library or local
  // For local imports, they should be relative to the current module root
  if (!isExternal) {
    // Try to find the imported file locally
    // Look in vendor directory first (common for Go projects)
    const potentialPaths = [
      path.join(process.cwd(), "vendor", importPath),
      path.join(currentDir, importPath),
      path.join(process.cwd(), importPath),
      path.join(process.cwd(), "src", importPath),
    ];

    for (const potentialPath of potentialPaths) {
      // Check if it's a directory with .go files
      if (
        fs.existsSync(potentialPath) &&
        fs.statSync(potentialPath).isDirectory()
      ) {
        try {
          const files = fs.readdirSync(potentialPath);
          for (const file of files) {
            // Only process .go files that aren't test files
            if (file.endsWith(".go") && !file.endsWith("_test.go")) {
              const fullPath = path.join(potentialPath, file);
              // Ensure we're only adding .go files
              dependencies.push(...collectGoDependencies(fullPath, visited));
            }
          }
          break;
        } catch (error) {
          console.warn(`Could not read directory ${potentialPath}:`, error);
        }
      }
      // Check if it's a .go file directly
      const goFilePath = potentialPath + ".go";
      if (fs.existsSync(goFilePath) && fs.statSync(goFilePath).isFile()) {
        // Ensure it's a .go file
        if (goFilePath.endsWith(".go")) {
          dependencies.push(...collectGoDependencies(goFilePath, visited));
          break;
        }
      }
    }
  }
}
