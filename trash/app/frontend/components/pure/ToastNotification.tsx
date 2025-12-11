import React from "react";
import { ToastContainer, Toast } from "react-bootstrap";

export const ToastNotification = ({ showToast, setShowToast, toastVariant, toastMessage }) => (
  <ToastContainer position="top-end" className="p-3">
    <Toast
      show={showToast}
      onClose={() => setShowToast(false)}
      delay={3000}
      autohide
      bg={toastVariant}
    >
      <Toast.Header>
        <strong className="me-auto">Command Status</strong>
      </Toast.Header>
      <Toast.Body className="text-white">{toastMessage}</Toast.Body>
    </Toast>
  </ToastContainer>
);
