import React from 'react';
import { Card, CardBody } from 'react-bootstrap';

export const DebugEnv: React.FC = () => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    clientId: process.env.GITHUB_CLIENT_ID,
    allProcessEnv: Object.keys(process.env)
      .filter(key => key.startsWith('REACT_APP_'))
      .reduce((obj, key) => {
        obj[key] = process.env[key];
        return obj;
      }, {} as Record<string, string | undefined>),
    windowEnv: typeof window !== 'undefined' ? (window as any).env : 'window not defined',
    location: typeof window !== 'undefined' ? window.location : 'window not defined'
  };

  return (
    <Card className="mt-3">
      <CardBody>
        <h6>Environment Debug (Development Only)</h6>
        <pre>{JSON.stringify(envInfo, null, 2)}</pre>
      </CardBody>
    </Card>
  );
};
