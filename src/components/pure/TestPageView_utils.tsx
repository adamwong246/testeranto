import React from "react";

type TestData = {
  name: string;
  givens: {
    name: string;
    whens: {
      name: string;
      error?: string;
      features?: string[];
      artifacts?: string[];
    }[];
    thens: {
      name: string;
      error?: string;
      features?: string[];
      artifacts?: string[];
    }[];
    features?: string[];
    artifacts?: string[];
  }[];
};

// Determine language from file extension
export const getLanguage = (path: string) => {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "js":
      return "javascript";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "py":
      return "python";
    default:
      return "plaintext";
  }
};

export const renderTestResults = (
  testData: TestData,
  buildErrors,
  projectName,
  testName,
  runtime
) => {
  return (
    <div className="test-results">
      {testData.givens.map((given, i) => (
        <div key={i} className="mb-4 card">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4>Given: {given.name}</h4>
                {given.features && given.features.length > 0 && (
                  <div className="mt-1">
                    <small>Features:</small>
                    <ul className="list-unstyled">
                      {given.features.map((feature, fi) => (
                        <li key={fi}>
                          {feature.startsWith("http") ? (
                            <a
                              href={feature}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white"
                            >
                              {new URL(feature).hostname}
                            </a>
                          ) : (
                            <span className="text-white">{feature}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {given.artifacts && given.artifacts.length > 0 && (
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    Artifacts ({given.artifacts.length})
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {given.artifacts.map((artifact, ai) => (
                      <li key={ai}>
                        <a
                          className="dropdown-item"
                          href={`reports/${projectName}/${testName
                            .split(".")
                            .slice(0, -1)
                            .join(".")}/${runtime}/${artifact}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {artifact.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="card-body">
            {given.whens.map((when, j) => (
              <div
                key={`w-${j}`}
                className={`p-3 mb-2 ${when.error ? "bg-danger text-white" : "bg-success text-white"
                  }`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div>
                      <strong>When:</strong> {when.name}
                      {when.features && when.features.length > 0 && (
                        <div className="mt-2">
                          <small>Features:</small>
                          <ul className="list-unstyled">
                            {when.features.map((feature, fi) => (
                              <li key={fi}>
                                {feature.startsWith("http") ? (
                                  <a
                                    href={feature}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {new URL(feature).hostname}
                                  </a>
                                ) : (
                                  feature
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {when.error && <pre className="mt-2">{when.error}</pre>}
                    </div>
                  </div>
                  {when.artifacts && when.artifacts.length > 0 && (
                    <div className="ms-3">
                      <strong>Artifacts:</strong>
                      <ul className="list-unstyled">
                        {when.artifacts.map((artifact, ai) => (
                          <li key={ai}>
                            <a
                              href={`reports/${projectName}/${testName
                                .split(".")
                                .slice(0, -1)
                                .join(".")}/${runtime}/${artifact}`}
                              target="_blank"
                              className="text-white"
                              rel="noopener noreferrer"
                            >
                              {artifact.split("/").pop()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {given.thens.map((then, k) => (
              <div
                key={`t-${k}`}
                className={`p-3 mb-2 ${then.error ? "bg-danger text-white" : "bg-success text-white"
                  }`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div>
                      <strong>Then:</strong> {then.name}
                      {then.features && then.features.length > 0 && (
                        <div className="mt-2">
                          <small>Features:</small>
                          <ul className="list-unstyled">
                            {then.features.map((feature, fi) => (
                              <li key={fi}>
                                {feature.startsWith("http") ? (
                                  <a
                                    href={feature}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {new URL(feature).hostname}
                                  </a>
                                ) : (
                                  feature
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {then.error && <pre className="mt-2">{then.error}</pre>}
                    </div>
                  </div>
                  {then.artifacts && then.artifacts.length > 0 && (
                    <div className="ms-3">
                      <strong>Artifacts:</strong>
                      <ul className="list-unstyled">
                        {then.artifacts.map((artifact, ai) => (
                          <li key={ai}>
                            <a
                              href={`reports/${projectName}/${testName
                                .split(".")
                                .slice(0, -1)
                                .join(".")}/${runtime}/${artifact}`}
                              target="_blank"
                              className="text-white"
                              rel="noopener noreferrer"
                            >
                              {artifact.split("/").pop()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Render build errors and warnings */}
      {(buildErrors.errors.length > 0 || buildErrors.warnings.length > 0) && (
        <div className="mb-4 card border-danger">
          <div className="card-header bg-danger text-white">
            <h4>Build Errors and Warnings</h4>
          </div>
          <div className="card-body">
            {buildErrors.errors.length > 0 && (
              <>
                <h5>Errors</h5>
                <ul>
                  {buildErrors.errors.map((error, idx) => (
                    <li key={`build-error-${idx}`}>
                      <strong>{error.text}</strong>
                      {error.location && (
                        <div>
                          File: {error.location.file} Line:{" "}
                          {error.location.line} Column: {error.location.column}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {buildErrors.warnings.length > 0 && (
              <>
                <h5>Warnings</h5>
                <ul>
                  {buildErrors.warnings.map((warning, idx) => (
                    <li key={`build-warning-${idx}`}>
                      <strong>{warning.text}</strong>
                      {warning.location && (
                        <div>
                          File: {warning.location.file} Line:{" "}
                          {warning.location.line} Column:{" "}
                          {warning.location.column}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
