/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../App";
import { Container, Row, Col } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import { ToastNotification } from "./ToastNotification";
import { MagicRobotModal } from "./MagicRobotModal";
import { TestPageNavbar } from "../TestPageNavbar";
import { TestPageMainContent } from "./TestPageMainContent";
import { TestPageLeftContent } from "./TestPageLeftContent";
export const TestPageView = ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, isWebSocketConnected, }) => {
    const navigate = useNavigate();
    const [showAiderModal, setShowAiderModal] = useState(false);
    const [messageOption, setMessageOption] = useState("default");
    const [customMessage, setCustomMessage] = useState(typeof logs["message.txt"] === "string"
        ? logs["message.txt"]
        : "make a script that prints hello");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [expandedSections, setExpandedSections] = useState({
        standardLogs: true,
        runtimeLogs: true,
        sourceFiles: true,
        buildErrors: true,
    });
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
    // Extract build errors and warnings relevant to this test
    const [buildErrors, setBuildErrors] = useState({ errors: [], warnings: [] });
    useEffect(() => {
        var _a, _b, _c;
        const metafile = (_a = logs.build_logs) === null || _a === void 0 ? void 0 : _a.metafile;
        if (!metafile) {
            setBuildErrors({ errors: [], warnings: [] });
            return;
        }
        const sourceFilesSet = new Set();
        // Collect all input files from metafile outputs related to this test
        Object.entries(metafile.outputs || {}).forEach(([outputPath, output]) => {
            // Normalize paths for comparison
            const normalizedTestName = testName.replace(/\\/g, "/");
            const normalizedEntryPoint = output.entryPoint
                ? output.entryPoint.replace(/\\/g, "/")
                : "";
            if (normalizedEntryPoint.includes(normalizedTestName)) {
                Object.keys(output.inputs || {}).forEach((inputPath) => {
                    sourceFilesSet.add(inputPath.replace(/\\/g, "/"));
                });
            }
        });
        // Filter errors and warnings to those originating from source files of this test
        const filteredErrors = (((_b = logs.build_logs) === null || _b === void 0 ? void 0 : _b.errors) || []).filter((err) => {
            if (!err.location || !err.location.file)
                return false;
            return sourceFilesSet.has(err.location.file.replace(/\\/g, "/"));
        });
        const filteredWarnings = (((_c = logs.build_logs) === null || _c === void 0 ? void 0 : _c.warnings) || []).filter((warn) => {
            if (!warn.location || !warn.location.file)
                return false;
            return sourceFilesSet.has(warn.location.file.replace(/\\/g, "/"));
        });
        setBuildErrors({ errors: filteredErrors, warnings: filteredWarnings });
    }, [logs, testName]);
    // Update customMessage when logs change
    useEffect(() => {
        if (typeof logs["message.txt"] === "string" && logs["message.txt"].trim()) {
            setCustomMessage(logs["message.txt"]);
        }
    }, [logs]);
    // Use the centralized WebSocket from App context
    const wsContext = useWebSocket();
    const ws = wsContext === null || wsContext === void 0 ? void 0 : wsContext.ws;
    const [activeTab, setActiveTab] = React.useState("tests.json");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedSourcePath, setSelectedSourcePath] = useState(null);
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    return (React.createElement(Container, { fluid: true, className: "px-0" },
        React.createElement(TestPageNavbar, { decodedTestPath: decodedTestPath, projectName: projectName, runtime: runtime, setShowAiderModal: setShowAiderModal, isWebSocketConnected: isWebSocketConnected }),
        React.createElement(MagicRobotModal, { customMessage: customMessage, isWebSocketConnected: isWebSocketConnected, messageOption: messageOption, navigate: navigate, projectName: projectName, runtime: runtime, setCustomMessage: setCustomMessage, setMessageOption: setMessageOption, setShowAiderModal: setShowAiderModal, setShowToast: setShowToast, setToastMessage: setToastMessage, setToastVariant: setToastVariant, showAiderModal: showAiderModal, testName: testName, ws: ws }),
        React.createElement(Row, { className: "g-0" },
            React.createElement(Col, { sm: 3, className: "border-end", style: {
                    height: "calc(100vh - 56px)",
                    overflow: "auto",
                    backgroundColor: "#f8f9fa",
                } },
                React.createElement(TestPageLeftContent, { setExpandedSections: setExpandedSections, expandedSections: expandedSections, logs: logs, setActiveTab: setActiveTab, setSelectedFile: setSelectedFile, runtime: runtime, selectedSourcePath: selectedSourcePath, activeTab: activeTab, setSelectedSourcePath: setSelectedSourcePath })),
            React.createElement(Col, { sm: 6, className: "border-end p-0", style: { height: "calc(100vh - 56px)", overflow: "hidden" } },
                React.createElement(Editor, { height: "100%", path: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || "empty", defaultLanguage: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.language) || "plaintext", value: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.content) || "// Select a file to view its contents", theme: editorTheme, options: {
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        automaticLayout: true,
                        readOnly: !(selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")),
                    } })),
            React.createElement(TestPageMainContent, { selectedFile: selectedFile, buildErrors: buildErrors, projectName: projectName, testName: testName, runtime: runtime })),
        React.createElement(ToastNotification, { showToast: showToast, setShowToast: setShowToast, toastVariant: toastVariant, toastMessage: toastMessage })));
};
