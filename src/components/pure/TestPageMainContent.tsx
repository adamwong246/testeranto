/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Col, Button } from "react-bootstrap";
import { renderTestResults } from "./TestPageView_utils";

export const TestPageMainContent = ({
  selectedFile,
  buildErrors,
  projectName,
  testName,
  runtime,
}) => (
  <Col
    sm={3}
    className="p-0 border-start"
    style={{ height: "calc(100vh - 56px)", overflow: "auto" }}
  >
    <div className="p-3">
      {selectedFile?.path.endsWith("tests.json") && (
        <div className="test-results-preview">
          {typeof selectedFile.content === "string"
            ? renderTestResults(
              JSON.parse(selectedFile.content),
              buildErrors,
              projectName,
              testName,
              runtime
            )
            : renderTestResults(
              selectedFile.content,
              buildErrors,
              projectName,
              testName,
              runtime
            )}
        </div>
      )}

      {selectedFile?.path.match(/\.(png|jpg|jpeg|gif|svg)$/i) && (
        <div className="text-center">
          <img
            src={selectedFile.content}
            alt={selectedFile.path}
            className="img-fluid"
            style={{ maxHeight: "300px" }}
          />
          <div className="mt-2">
            <a
              href={selectedFile.content}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-primary"
            >
              Open Full Size
            </a>
          </div>
        </div>
      )}

      {selectedFile?.path.endsWith("build.json") && (
        <div>
          <h5>Build Information</h5>
          {(() => {
            try {
              const buildData = JSON.parse(selectedFile.content);
              return (
                <>
                  {buildData.errors?.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-danger">
                        Errors ({buildData.errors.length})
                      </h6>
                      <ul className="list-unstyled">
                        {buildData.errors.map((error: any, index: number) => (
                          <li key={index} className="mb-2 p-2  rounded">
                            <div className="text-danger fw-bold">
                              {error.text}
                            </div>
                            {error.location && (
                              <div className="small text-muted">
                                File: {error.location.file}
                                Line: {error.location.line}
                                Column: {error.location.column}
                              </div>
                            )}
                            {error.notes && error.notes.length > 0 && (
                              <div className="small">
                                Notes:
                                <ul>
                                  {error.notes.map(
                                    (note: any, noteIndex: number) => (
                                      <li key={noteIndex}>{note.text}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {buildData.warnings?.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-warning">
                        Warnings ({buildData.warnings.length})
                      </h6>
                      <ul className="list-unstyled">
                        {buildData.warnings.map(
                          (warning: any, index: number) => (
                            <li key={index} className="mb-2 p-2  rounded">
                              <div className="text-warning fw-bold">
                                {warning.text}
                              </div>
                              {warning.location && (
                                <div className="small text-muted">
                                  File: {warning.location.file}
                                  Line: {warning.location.line}
                                  Column: {warning.location.column}
                                </div>
                              )}
                              {warning.notes && warning.notes.length > 0 && (
                                <div className="small">
                                  Notes:
                                  <ul>
                                    {warning.notes.map(
                                      (note: any, noteIndex: number) => (
                                        <li key={noteIndex}>{note.text}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {(!buildData.errors || buildData.errors.length === 0) &&
                    (!buildData.warnings ||
                      buildData.warnings.length === 0) && (
                      <div className="alert alert-success">
                        No build errors or warnings
                      </div>
                    )}
                </>
              );
            } catch (e) {
              return (
                <div className="alert alert-danger">
                  Error parsing build.json: {e.message}
                </div>
              );
            }
          })()}
        </div>
      )}

      {selectedFile?.path.endsWith(".json") &&
        !selectedFile.path.endsWith("tests.json") &&
        !selectedFile.path.endsWith("build.json") && (
          <pre className=" p-2 small">
            <code>{selectedFile.content}</code>
          </pre>
        )}

      {selectedFile?.path.includes("source_files") && (
        <div>
          <div className="mb-2 small text-muted">
            <i className="bi bi-file-earmark-text me-1"></i>
            {selectedFile.path.split("/").pop()}
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            className="mb-2"
            onClick={() => {
              // TODO: Add save functionality
              alert("Save functionality will be implemented here");
            }}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  </Col>
);
