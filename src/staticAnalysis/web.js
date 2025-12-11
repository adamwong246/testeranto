// Web static analysis (extends Node.js analysis with web-specific checks)
// This is a runtime-native check file that will be executed by the analysis service
// It receives the metafile path as the first argument

import { ESLint } from 'eslint';
import typescript from 'typescript';
import fs from 'fs';
import path from 'path';

async function runStaticAnalysis(metafilePath) {
  console.log('Web static analysis starting...');
  
  // Read metafile
  const metafile = JSON.parse(fs.readFileSync(metafilePath, 'utf8'));
  const files = Object.keys(metafile.inputs || {});
  
  console.log(`Found ${files.length} files in metafile`);
  
  const results = {
    eslint: [],
    typescript: [],
    stylelint: [],
    summary: {
      totalFiles: files.length,
      analyzedFiles: 0,
      errors: 0,
      warnings: 0
    }
  };
  
  // Filter for web files
  const webFiles = files.filter(f => 
    f.endsWith('.ts') || f.endsWith('.tsx') || 
    f.endsWith('.js') || f.endsWith('.jsx') ||
    f.endsWith('.css') || f.endsWith('.scss') || f.endsWith('.sass')
  );
  
  if (webFiles.length === 0) {
    console.log('No web files found for analysis');
    return results;
  }
  
  // Separate file types
  const tsJsFiles = webFiles.filter(f => 
    f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')
  );
  
  const styleFiles = webFiles.filter(f => 
    f.endsWith('.css') || f.endsWith('.scss') || f.endsWith('.sass')
  );
  
  // Run ESLint for TypeScript/JavaScript files
  if (tsJsFiles.length > 0) {
    try {
      const eslint = new ESLint({ 
        useEslintrc: true,
        cwd: process.cwd(),
        fix: false
      });
      
      const eslintResults = await eslint.lintFiles(tsJsFiles);
      results.eslint = eslintResults.map(result => ({
        filePath: result.filePath,
        messages: result.messages,
        errorCount: result.errorCount,
        warningCount: result.warningCount,
        fixableErrorCount: result.fixableErrorCount,
        fixableWarningCount: result.fixableWarningCount
      }));
      
      results.summary.errors += eslintResults.reduce((sum, r) => sum + r.errorCount, 0);
      results.summary.warnings += eslintResults.reduce((sum, r) => sum + r.warningCount, 0);
      results.summary.analyzedFiles += tsJsFiles.length;
      
    } catch (error) {
      console.warn('ESLint analysis failed:', error.message);
    }
  }
  
  // Run TypeScript type checking
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsConfigPath) && tsJsFiles.some(f => f.endsWith('.ts') || f.endsWith('.tsx'))) {
    try {
      const tsConfigFile = typescript.readConfigFile(tsConfigPath, tsPath => 
        fs.readFileSync(tsPath, 'utf8'));
      
      if (tsConfigFile.error) {
        console.warn('TypeScript config error:', tsConfigFile.error.messageText);
      } else {
        const tsProgram = typescript.createProgram(tsJsFiles, tsConfigFile.config);
        const tsResults = tsProgram.getSemanticDiagnostics()
          .concat(tsProgram.getSyntacticDiagnostics())
          .concat(tsProgram.getDeclarationDiagnostics());
        
        results.typescript = tsResults.map(diagnostic => ({
          file: diagnostic.file?.fileName,
          start: diagnostic.start,
          length: diagnostic.length,
          messageText: typeof diagnostic.messageText === 'string' 
            ? diagnostic.messageText 
            : diagnostic.messageText?.messageText,
          category: diagnostic.category === typescript.DiagnosticCategory.Error ? 'error' : 'warning',
          code: diagnostic.code
        }));
        
        results.summary.errors += tsResults.filter(d => 
          d.category === typescript.DiagnosticCategory.Error
        ).length;
        results.summary.warnings += tsResults.filter(d => 
          d.category === typescript.DiagnosticCategory.Warning
        ).length;
      }
    } catch (error) {
      console.warn('TypeScript analysis failed:', error.message);
    }
  }
  
  // Run stylelint for CSS/SCSS files if available
  if (styleFiles.length > 0) {
    try {
      // Try to import stylelint dynamically
      const { lint } = await import('stylelint');
      
      console.log('Running stylelint...');
      const stylelintResults = await lint({
        files: styleFiles,
        configFile: path.join(process.cwd(), '.stylelintrc') // or use package.json
      });
      
      results.stylelint = stylelintResults.results.map(result => ({
        filePath: result.source,
        warnings: result.warnings,
        errored: result.errored
      }));
      
      results.summary.errors += stylelintResults.results.reduce((sum, r) => 
        sum + r.warnings.filter(w => w.severity === 'error').length, 0);
      results.summary.warnings += stylelintResults.results.reduce((sum, r) => 
        sum + r.warnings.filter(w => w.severity === 'warning').length, 0);
      results.summary.analyzedFiles += styleFiles.length;
      
    } catch (error) {
      console.warn('stylelint not available or failed:', error.message);
    }
  }
  
  console.log('Web static analysis completed');
  console.log(`Summary: ${results.summary.errors} errors, ${results.summary.warnings} warnings`);
  
  return results;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const metafilePath = process.argv[2];
  if (!metafilePath) {
    console.error('Usage: node web.js <metafile-path>');
    process.exit(1);
  }
  
  runStaticAnalysis(metafilePath)
    .then(results => {
      console.log(JSON.stringify(results, null, 2));
      // Exit with non-zero code if there are errors
      if (results.summary.errors > 0) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Static analysis failed:', error);
      process.exit(1);
    });
}

export default runStaticAnalysis;
