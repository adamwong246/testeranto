"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPage = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const api_1 = require("../../utils/api");
const TestPageView_1 = require("../pure/TestPageView");
const TestPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const [route, setRoute] = (0, react_1.useState)('results');
    // Sync route with hash changes
    (0, react_1.useEffect)(() => {
        const hash = location.hash.replace('#', '');
        if (hash && ['results', 'logs', 'types', 'lint', 'coverage'].includes(hash)) {
            setRoute(hash);
        }
        else {
            setRoute('results');
        }
    }, [location.hash]);
    const [testName, setTestName] = (0, react_1.useState)('');
    // const [testData, setTestData] = useState(null);
    const [logs, setLogs] = (0, react_1.useState)({});
    // const [typeErrors, setTypeErrors] = useState('');
    // const [lintErrors, setLintErrors] = useState('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [testsExist, setTestsExist] = (0, react_1.useState)(true);
    const [errorCounts, setErrorCounts] = (0, react_1.useState)({
        typeErrors: 0,
        staticErrors: 0,
        runTimeErrors: 0
    });
    const [summary, setSummary] = (0, react_1.useState)(null);
    const { projectName, '*': splat } = (0, react_router_dom_1.useParams)();
    const pathParts = splat ? splat.split('/') : [];
    const runtime = pathParts.pop() || '';
    const testPath = pathParts.join('/');
    const decodedTestPath = testPath ? decodeURIComponent(testPath) : '';
    (0, react_1.useEffect)(() => {
        if (!projectName || !testPath || !runtime)
            return;
        setTestName(testPath);
        const fetchData = async () => {
            var _a;
            try {
                const [testResponse, metafileRes] = await Promise.all([
                    (0, api_1.fetchTestData)(projectName, testPath, runtime),
                    fetch(`metafiles/${runtime}/${projectName}.json`)
                ]);
                console.log('Fetching test data for:', { projectName, testPath, runtime });
                const receivedLogs = await testResponse.logs;
                console.log('Received logs:', Object.keys(receivedLogs));
                let sourceFiles = {};
                if (metafileRes.ok) {
                    const metafile = await metafileRes.json();
                    if ((_a = metafile === null || metafile === void 0 ? void 0 : metafile.metafile) === null || _a === void 0 ? void 0 : _a.outputs) {
                        // Find input files only for this test's entry point
                        const tsSources = new Set();
                        const testEntryPoint = `src/${testPath}`;
                        // First find all outputs that match this test
                        const matchingOutputs = Object.entries(metafile.metafile.outputs)
                            .filter(([outputPath, output]) => {
                            const normalizedTestPath = testPath.replace(/\./g, '_');
                            const testFileName = testPath.split('/').pop();
                            const testBaseName = testFileName === null || testFileName === void 0 ? void 0 : testFileName.split('.').slice(0, -1).join('.');
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
                        const filesList = await Promise.all(Array.from(tsSources).map(async (filePath) => {
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
                            }
                            catch (err) {
                                console.warn(`Failed to fetch source file ${filePath}:`, err);
                                return null;
                            }
                        }));
                        filesList.forEach(file => {
                            if (!file)
                                return;
                            const parts = file.path.split('/');
                            let currentLevel = fileTree;
                            parts.forEach((part, index) => {
                                if (!currentLevel[part]) {
                                    if (index === parts.length - 1) {
                                        currentLevel[part] = {
                                            __isFile: true,
                                            content: file.content
                                        };
                                    }
                                    else {
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
                        receivedLogs['tests.json'] = typeof receivedLogs['tests.json'] === 'string'
                            ? JSON.parse(receivedLogs['tests.json'])
                            : receivedLogs['tests.json'];
                    }
                    catch (e) {
                        console.error('Failed to parse tests.json:', e);
                        receivedLogs['tests.json'] = { error: 'Invalid test data format' };
                    }
                }
                setLogs(receivedLogs);
                // setTypeErrors(testResponse.typeErrors);
                // setLintErrors(testResponse.lintErrors);
                try {
                    const summaryResponse = await fetch(`reports/${projectName}/summary.json`);
                    if (!summaryResponse.ok)
                        throw new Error('Failed to fetch summary');
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
                }
                catch (err) {
                    console.error('Failed to load summary:', err);
                }
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setTestsExist(false);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (!logs)
        return react_1.default.createElement("div", null, "loading...");
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(TestPageView_1.TestPageView, { route: route, setRoute: setRoute, navigate: navigate, projectName: projectName, testName: testName, decodedTestPath: decodedTestPath, runtime: runtime, logs: logs, testsExist: testsExist, errorCounts: errorCounts })));
};
exports.TestPage = TestPage;
