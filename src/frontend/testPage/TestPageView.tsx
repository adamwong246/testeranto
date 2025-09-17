/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../App";
import { Container, Row, Col } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";

import { ToastNotification } from "../../components/pure/ToastNotification";
import { MagicRobotModal } from "../../components/pure/MagicRobotModal";
import { TestPageNavbar } from "./TestPageNavbar";
import { TestPageMainContent } from "./TestPageMainContent";
import { TestPageLeftContent } from "./TestPageLeftContent";

type TestPageViewProps = {
  projectName: string;
  testName: string;
  decodedTestPath: string;
  runtime: string;
  logs: Record<string, string>;
  testsExist: boolean;
  errorCounts: {
    runTimeErrors: number;
    typeErrors: number;
    staticErrors: number;
  };
  isWebSocketConnected: boolean;
};

export const TestPageView = ({
  projectName,
  testName,
  decodedTestPath,
  runtime,
  testsExist,
  errorCounts,
  logs,
  isWebSocketConnected,
}: TestPageViewProps) => {
  const navigate = useNavigate();
  const [showAiderModal, setShowAiderModal] = useState(false);
  const [messageOption, setMessageOption] = useState<"default" | "custom">(
    "default"
  );
  const [customMessage, setCustomMessage] = useState(
    typeof logs["message.txt"] === "string"
      ? logs["message.txt"]
      : "make a script that prints hello"
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [expandedSections, setExpandedSections] = useState({
    standardLogs: true,
    runtimeLogs: true,
    sourceFiles: true,
    buildErrors: true,
  });
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  // Extract build errors and warnings relevant to this test
  const [buildErrors, setBuildErrors] = useState<{
    errors: any[];
    warnings: any[];
  }>({ errors: [], warnings: [] });

  useEffect(() => {
    const metafile = logs.build_logs?.metafile;
    if (!metafile) {
      setBuildErrors({ errors: [], warnings: [] });
      return;
    }
    const sourceFilesSet = new Set<string>();
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
    const filteredErrors = (logs.build_logs?.errors || []).filter(
      (err: any) => {
        if (!err.location || !err.location.file) return false;
        return sourceFilesSet.has(err.location.file.replace(/\\/g, "/"));
      }
    );
    const filteredWarnings = (logs.build_logs?.warnings || []).filter(
      (warn: any) => {
        if (!warn.location || !warn.location.file) return false;
        return sourceFilesSet.has(warn.location.file.replace(/\\/g, "/"));
      }
    );

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
  const ws = wsContext?.ws;
  const [activeTab, setActiveTab] = React.useState("tests.json");
  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    content: string;
    language?: string;
  } | null>(null);
  const [selectedSourcePath, setSelectedSourcePath] = useState<string | null>(
    null
  );
  const [editorTheme, setEditorTheme] = useState<"light" | "vs-dark">(
    "vs-dark"
  );

  return (
    <Container fluid className="px-0">
      <TestPageNavbar
        decodedTestPath={decodedTestPath}
        projectName={projectName}
        runtime={runtime}
        setShowAiderModal={setShowAiderModal}
        isWebSocketConnected={isWebSocketConnected}
      />

      <MagicRobotModal
        customMessage={customMessage}
        isWebSocketConnected={isWebSocketConnected}
        messageOption={messageOption}
        navigate={navigate}
        projectName={projectName}
        runtime={runtime}
        setCustomMessage={setCustomMessage}
        setMessageOption={setMessageOption}
        setShowAiderModal={setShowAiderModal}
        setShowToast={setShowToast}
        setToastMessage={setToastMessage}
        setToastVariant={setToastVariant}
        showAiderModal={showAiderModal}
        testName={testName}
        ws={ws}
      />

      <Row className="g-0">
        <Col
          sm={3}
          className="border-end"
          style={{
            height: "calc(100vh - 56px)",
            overflow: "auto",
            backgroundColor: "#f8f9fa",
          }}
        >
          <TestPageLeftContent
            setExpandedSections={setExpandedSections}
            expandedSections={expandedSections}
            logs={logs}
            setActiveTab={setActiveTab}
            setSelectedFile={setSelectedFile}
            runtime={runtime}
            selectedSourcePath={selectedSourcePath}
            activeTab={activeTab}
            setSelectedSourcePath={setSelectedSourcePath}
          />
        </Col>

        <Col
          sm={6}
          className="border-end p-0"
          style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}
        >
          <Editor
            height="100%"
            path={selectedFile?.path || "empty"}
            defaultLanguage={selectedFile?.language || "plaintext"}
            value={
              selectedFile?.content || "// Select a file to view its contents"
            }
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              readOnly: !selectedFile?.path.includes("source_files"),
            }}
          />
        </Col>

        <TestPageMainContent
          selectedFile={selectedFile}
          buildErrors={buildErrors}
          projectName={projectName}
          testName={testName}
          runtime={runtime}
        />
      </Row>

      <ToastNotification
        showToast={showToast}
        setShowToast={setShowToast}
        toastVariant={toastVariant}
        toastMessage={toastMessage}
      />
    </Container>
  );
};
