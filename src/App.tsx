import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDom from "react-dom/client";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import { TestPage } from './components/stateful/TestPage';
import { ProjectPage } from './components/stateful/ProjectPage';
import { ProjectsPage } from './components/stateful/ProjectsPage';
import { AppFrame } from './components/pure/AppFrame';
import { FeaturesReporter } from './components/stateful/FeaturesReporter';
import { DesignEditorPage } from './components/DesignEditorPage';
import { TextEditorPage } from './components/stateful/TextEditorPage';
import { ProcessManagerPage } from './components/stateful/ProcessManagerPage';
import { SingleProcessPage } from './components/stateful/SingleProcessPage';
import { Settings } from './components/pure/Settings';
import { GitIntegrationPage } from './components/stateful/GitIntegrationPage';

interface WebSocketContextType {
  ws: WebSocket | null;
  isConnected: boolean;
}

interface TutorialModeContextType {
  tutorialMode: boolean;
  setTutorialMode: (mode: boolean) => void;
}

// Create a context for the WebSocket
const WebSocketContext = createContext<WebSocketContextType>({
  ws: null,
  isConnected: false,
});

// Create a context for tutorial mode
const TutorialModeContext = createContext<TutorialModeContextType>({
  tutorialMode: false,
  setTutorialMode: () => {},
});

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const useTutorialMode = () => {
  return useContext(TutorialModeContext);
};

export const App = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tutorialMode, setTutorialMode] = useState(false);

  useEffect(() => {
    // Load tutorial mode from localStorage
    const savedTutorialMode = localStorage.getItem('tutorialMode');
    if (savedTutorialMode) {
      setTutorialMode(savedTutorialMode === 'true');
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setWs(websocket);
      setIsConnected(true);
    };
    
    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
      setIsConnected(false);
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws, isConnected }}>
      <TutorialModeContext.Provider value={{ tutorialMode, setTutorialMode }}>
        <Router>
          <AppFrame>
            <Routes>
              <Route path="/" element={<ProjectsPage />} />
              <Route path="/projects/:projectName" element={<ProjectPage />} />
              <Route path="/projects/:projectName/tests/*" element={<TestPage />} />
              <Route path="/projects/:projectName#:tab" element={<ProjectPage />} />
              <Route path="/features-reporter" element={<FeaturesReporter />} />
              <Route path="/design-editor" element={<DesignEditorPage />} />
              <Route path="/text-editor" element={<TextEditorPage />} />
              {/* Conditionally render process-related routes only if WebSocket is connected */}
              {isConnected ? (
                <>
                  <Route path="/processes" element={<ProcessManagerPage />} />
                  <Route path="/processes/:processId" element={<SingleProcessPage />} />
                </>
              ) : null}
              <Route path="/settings" element={<Settings />} />
              <Route path="/git" element={<GitIntegrationPage />} />
            </Routes>
          </AppFrame>
        </Router>
      </TutorialModeContext.Provider>
    </WebSocketContext.Provider>
  );
};

// Export App to global scope
function initApp() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      // Try to use React 18's createRoot if available
      if (ReactDom.createRoot) {
        const root = ReactDom.createRoot(rootElement);
        root.render(React.createElement(App));
      } else {
        // Fall back to React 17's render
        ReactDom.render(React.createElement(App), rootElement);
      }
    } catch (err) {
      console.error('Error rendering app:', err);
      // Retry if React isn't loaded yet
      setTimeout(initApp, 100);
    }
  } else {
    // Retry if root element isn't available yet
    setTimeout(initApp, 100);
  }
}

// Export App to global scope
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // @ts-ignore
  window.App = App;
  // @ts-ignore
  window.React = React;
  // @ts-ignore
  window.ReactDOM = ReactDom;
  
  // Initialize the app when the window is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
