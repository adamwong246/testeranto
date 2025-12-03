import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

import { GitHubLoginButton } from "./GitHubLoginButton";
import { githubAuthService } from "../../GitHubAuthService";

export const SignIn = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className="text-center">
              <h3 className="mb-0">Sign In</h3>
            </Card.Header>
            <Card.Body className="text-center">
              {githubAuthService.isConfigured() ? (
                <GitHubLoginButton />
              ) : (
                <div>
                  <p className="text-danger">
                    GitHub authentication is not configured
                  </p>
                  <p>Please contact the administrator</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
