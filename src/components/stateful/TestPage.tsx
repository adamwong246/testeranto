/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DesignEditor } from '../../../design-editor/DesignEditor';
import { fetchTestData } from '../../utils/api';

import { TestPageView } from '../pure/TestPageView';


export const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [route, setRoute] = useState('results');

  // Sync route with hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['results', 'logs', 'types', 'lint', 'coverage'].includes(hash)) {
      setRoute(hash);
    } else {
      setRoute('results');
    }
  }, [location.hash]);

  const [testName, setTestName] = useState('');
  // const [testData, setTestData] = useState(null);
  const [logs, setLogs] = useState<Record<string, string>>({});
  // const [typeErrors, setTypeErrors] = useState('');
  // const [lintErrors, setLintErrors] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testsExist, setTestsExist] = useState(true);
  const [errorCounts, setErrorCounts] = useState({
    typeErrors: 0,
    staticErrors: 0,
    runTimeErrors: 0
  });
  const [summary, setSummary] = useState(null);

  const { projectName, '*': splat } = useParams();
  const pathParts = splat ? splat.split('/') : [];
  const runtime = pathParts.pop() || '';
  const testPath = pathParts.join('/');
  const decodedTestPath = testPath ? decodeURIComponent(testPath) : '';

  useEffect(() => {
    if (!projectName || !testPath || !runtime) return;
    setTestName(testPath);

    const fetchData = async () => {
      try {
        const [testResponse, metafileRes] = await Promise.all([
          fetchTestData(projectName, testPath, runtime),
          fetch(`/metafiles/${runtime}/${projectName}.json`)
        ]);
        
        console.log('Fetching test data for:', { projectName, testPath, runtime });
        const receivedLogs = await testResponse.logs;
        console.log('Received logs:', Object.keys(receivedLogs));
        let sourceFiles = {};
        
        if (metafileRes.ok) {
          const metafile = await metafileRes.json();
          if (metafile?.metafile?.outputs) {
            // Find input files only for this test's entry point
            const tsSources = new Set<string>();
            const testEntryPoint = `src/${testPath}`;
            
            // First find all outputs that match this test
            const matchingOutputs = Object.entries(metafile.metafile.outputs)
              .filter(([outputPath, output]) => {
                const normalizedTestPath = testPath.replace(/\./g, '_');
                const testFileName = testPath.split('/').pop();
                const testBaseName = testFileName?.split('.').slice(0, -1).join('.');
                
                return output.entryPoint === testEntryPoint || 
                  outputPath.includes(normalizedTestPath) ||
                  (testBaseName && outputPath.includes(testBaseName));
              });

            // Then collect all inputs from matching outputs
            matchingOutputs.forEach(([_, output]) => {
              Object.keys(output.inputs).forEach(inputPath => {
                // Check if this input is a TypeScript file and not in node_modules
                if ((inputPath.endsWith('.ts') || inputPath.endsWith('.tsx')) &&
                    !inputPath.includes('node_modules')) {
                  // Get the full input details from metafile.inputs
                  const inputDetails = metafile.metafile.inputs[inputPath];
                  if (inputDetails) {
                    tsSources.add(inputPath);
                    // Also include any imported TypeScript files
                    inputDetails.imports.forEach(imp => {
                      if ((imp.path.endsWith('.ts') || imp.path.endsWith('.tsx')) &&
                          !imp.path.includes('node_modules') &&
                          !imp.external) {
                        tsSources.add(imp.path);
                      }
                    });
                  }
                }
              });
            });
            
            // Organize source files into directory tree structure
            const fileTree = {};
            const filesList = await Promise.all(
              Array.from(tsSources).map(async (filePath) => {
                try {
                  const fetchPath = filePath.startsWith('/') 
                    ? filePath 
                    : `/${filePath.replace(/^\.\//, '')}`;
                  const res = await fetch(fetchPath);
                  if (res.ok) {
                    return {
                      path: filePath,
                      content: await res.text()
                    };
                  }
                  return null;
                } catch (err) {
                  console.warn(`Failed to fetch source file ${filePath}:`, err);
                  return null;
                }
              })
            );

            filesList.forEach(file => {
              if (!file) return;
              
              const parts = file.path.split('/');
              let currentLevel = fileTree;
              
              parts.forEach((part, index) => {
                if (!currentLevel[part]) {
                  if (index === parts.length - 1) {
                    currentLevel[part] = {
                      __isFile: true,
                      content: file.content
                    };
                  } else {
                    currentLevel[part] = {};
                  }
                }
                currentLevel = currentLevel[part];
              });
            });

            sourceFiles = fileTree;
          }
        }

        // Add source files to logs
        receivedLogs['source_files'] = sourceFiles;
        console.log('Source files structure:', sourceFiles);
        
        // Ensure tests.json is properly formatted
        if (receivedLogs['tests.json']) {
          console.log('tests.json content type:', typeof receivedLogs['tests.json']);
          try {
            // Handle both string and already-parsed JSON
            if (typeof receivedLogs['tests.json'] === 'string') {
              receivedLogs['tests.json'] = JSON.parse(receivedLogs['tests.json']);
            }
            // If it's already an object, leave it as is
          } catch (e) {
            console.error('Failed to parse tests.json:', e);
            // Keep the original content but don't replace it with an error object
          }
        }
        setLogs(receivedLogs);
        // setTypeErrors(testResponse.typeErrors);
        // setLintErrors(testResponse.lintErrors);

        try {
          const summaryResponse = await fetch(`/reports/${projectName}/summary.json`);
          if (!summaryResponse.ok) throw new Error('Failed to fetch summary');
          const allSummaries = await summaryResponse.json();
          const testSummary = allSummaries[testPath];

          if (testSummary) {
            const counts = {
              typeErrors: Number(testSummary.typeErrors) || 0,
              staticErrors: Number(testSummary.staticErrors) || 0,
              runTimeErrors: Number(testSummary.runTimeErrors) || 0
            };

            setSummary(testSummary);
            setErrorCounts(counts);
            setTestsExist(testSummary.testsExist !== false);
          }
        } catch (err) {
          console.error('Failed to load summary:', err);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTestsExist(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!logs) return <div>loading...</div>

  return (
    <>
      {/* <DesignEditor projectId="demo-project" /> */}
      <TestPageView
        route={route as 'results' | 'logs' | 'types' | 'lint' | 'coverage'}
        setRoute={setRoute}
        navigate={navigate}
        projectName={projectName as string}
        testName={testName}
        decodedTestPath={decodedTestPath}
        runtime={runtime}
        logs={logs}
        testsExist={testsExist}
        errorCounts={errorCounts}
      />
    </>
  );
};
