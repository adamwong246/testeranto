import React from "react";

export const Helpo = () => (
  <div className="d-flex flex-column h-100">
    <div className="border-bottom p-3"></div>
    <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
      {/* Chat messages */}
      <div className="d-flex mb-3">
        <div className="me-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
            style={{ width: "40px", height: "40px" }}
          >
            🤖
          </div>
        </div>
        <div className="flex-grow-1">
          <div className="fw-bold">Helpo</div>
          <div className="bg-light p-3 rounded">
            <p>
              Hello! I'm Helpo, your helpful robot assistant. How can I assist
              you today?
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex mb-3 justify-content-end">
        <div className="flex-grow-1 me-2 text-end">
          <div className="fw-bold">You</div>
          <div className="bg-primary text-white p-3 rounded">
            <p>
              Can you show me how to format text with <strong>bold</strong> and{" "}
              <em>italic</em>?
            </p>
          </div>
        </div>
        <div>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white"
            style={{ width: "40px", height: "40px" }}
          >
            👤
          </div>
        </div>
      </div>

      <div className="d-flex mb-3">
        <div className="me-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
            style={{ width: "40px", height: "40px" }}
          >
            🤖
          </div>
        </div>
        <div className="flex-grow-1">
          <div className="fw-bold">Helpo</div>
          <div className="bg-light p-3 rounded">
            <p>Sure! Here's an example:</p>
            <ul>
              <li>
                Use <code>&lt;strong&gt;</code> for <strong>bold text</strong>
              </li>
              <li>
                Use <code>&lt;em&gt;</code> for <em>italic text</em>
              </li>
              <li>You can even include lists and other HTML elements</li>
            </ul>
            <p>Let me know if you need help with anything else!</p>
          </div>
        </div>
      </div>
    </div>
    <div className="border-top p-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          disabled
        />
        <button className="btn btn-primary" type="button" disabled>
          Send
        </button>
      </div>
    </div>
  </div>
);
