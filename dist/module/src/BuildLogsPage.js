import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Badge } from 'react-bootstrap';
export const BuildLogsPage = () => {
    const { projectName, runtime } = useParams();
    const [logs, setLogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchBuildLogs = async () => {
            try {
                // Mock data - replace with actual API call
                const mockLogs = {
                    errors: [
                        "Error: Could not resolve './someModule'",
                        "TypeError: Cannot read property 'map' of undefined"
                    ],
                    warnings: [
                        "Warning: Circular dependency detected",
                        "Warning: Unused import"
                    ],
                    inputs: {
                        "src/lib/index.ts": {
                            bytes: 3565,
                            imports: []
                        }
                    },
                    outputs: {
                        "dist/bundle.js": {
                            bytes: 12345
                        }
                    }
                };
                setLogs(mockLogs);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        };
        fetchBuildLogs();
    }, [projectName, runtime]);
    if (loading)
        return React.createElement("div", null, "Loading build logs...");
    if (error)
        return React.createElement(Alert, { variant: "danger" },
            "Error: ",
            error);
    return (React.createElement("div", null,
        React.createElement("h1", null,
            "Build Logs",
            React.createElement(Badge, { bg: "info", className: "ms-2" }, runtime),
            React.createElement(Badge, { bg: "secondary", className: "ms-2" }, projectName)),
        logs ? (React.createElement("div", null,
            React.createElement("h2", { className: "mt-4" }, "Errors"),
            logs.errors.length > 0 ? (React.createElement("div", { className: "mb-4" }, logs.errors.map((err, i) => (React.createElement(Alert, { key: i, variant: "danger", className: "mb-2" }, err))))) : (React.createElement(Alert, { variant: "success" }, "No errors found")),
            React.createElement("h2", { className: "mt-4" }, "Warnings"),
            logs.warnings.length > 0 ? (React.createElement("div", { className: "mb-4" }, logs.warnings.map((warn, i) => (React.createElement(Alert, { key: i, variant: "warning", className: "mb-2" }, warn))))) : (React.createElement(Alert, { variant: "success" }, "No warnings found")),
            React.createElement("h2", { className: "mt-4" }, "Input Files"),
            React.createElement("pre", { className: "bg-light p-3" }, JSON.stringify(logs.inputs, null, 2)),
            React.createElement("h2", { className: "mt-4" }, "Output Files"),
            React.createElement("pre", { className: "bg-light p-3" }, JSON.stringify(logs.outputs, null, 2)))) : (React.createElement(Alert, { variant: "warning" }, "No build logs found"))));
};
