"use strict";
// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { Badge, Alert } from 'react-bootstrap';
// import { Process } from './ProcessManagerView';
// import { useWebSocket } from '../../App';
// import { ProcessSidebar } from './ProcessSidebar';
// import { ProcessLogs } from './ProcessLogs';
// import { ProcessInput } from './ProcessInput';
// interface SingleProcessViewProps {
//   process: Process | null;
//   onBack: () => void;
//   loading: boolean;
//   onKillProcess?: (processId: string) => void;
// }
// export const SingleProcessView: React.FC<SingleProcessViewProps> = ({
//   process,
//   loading,
// }) => {
//   const ws = useWebSocket();
//   const [inputValue, setInputValue] = useState('');
//   // Memoized derived state
//   const isRunning = useMemo(() => process?.status === 'running', [process?.status]);
//   const webSocketStatus = useMemo(() => {
//     const currentWs = ws?.ws;
//     if (!currentWs) return 'disconnected';
//     switch (currentWs.readyState) {
//       case WebSocket.CONNECTING: return 'connecting';
//       case WebSocket.OPEN: return 'connected';
//       case WebSocket.CLOSING: return 'closing';
//       case WebSocket.CLOSED: return 'disconnected';
//       default: return 'unknown';
//     }
//   }, [ws?.ws?.readyState]);
//   // Handle user input
//   const handleInput = useCallback((data: string) => {
//     const currentWs = ws?.ws;
//     console.log('handleInput called with:', {
//       data,
//       hasWs: !!currentWs,
//       wsReadyState: currentWs?.readyState,
//       processId: process?.processId,
//       processStatus: process?.status
//     });
//     if (currentWs && currentWs.readyState === WebSocket.OPEN && process?.status === 'running') {
//       console.log('Sending stdin:', data);
//       const message = JSON.stringify({
//         type: 'stdin',
//         processId: process.processId,
//         data: data
//       });
//       console.log('Sending message:', message);
//       currentWs.send(message);
//     } else {
//       console.log('Cannot send stdin - conditions not met:', {
//         wsExists: !!currentWs,
//         wsReadyState: currentWs?.readyState,
//         processStatus: process?.status,
//         processId: process?.processId
//       });
//     }
//   }, [ws?.ws, process?.processId, process?.status]);
//   const handleInputSubmit = useCallback(() => {
//     console.log('handleInputSubmit called, inputValue:', inputValue);
//     if (inputValue.trim()) {
//       console.log('Submitting input:', inputValue);
//       handleInput(inputValue + '\n');
//       setInputValue('');
//     } else {
//       console.log('Input value is empty or whitespace only');
//     }
//   }, [inputValue, handleInput]);
//   const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
//     console.log('Key pressed:', e.key);
//     if (e.key === 'Enter') {
//       console.log('Enter key detected, calling handleInputSubmit');
//       handleInputSubmit();
//       e.preventDefault();
//     }
//   }, [handleInputSubmit]);
//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     console.log('Input changed:', e.target.value);
//     setInputValue(e.target.value);
//   }, []);
//   // Render loading state
//   if (loading) {
//     return <div>Initializing terminal...</div>;
//   }
//   // Render process not found state
//   if (!process) {
//     return (
//       <Alert variant="warning">
//         Process not found or not running. The process may have completed.
//       </Alert>
//     );
//   }
//   return (
//     <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       {/* Main content area */}
//       <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
//         {/* Sidebar */}
//         <ProcessSidebar process={process} webSocketStatus={webSocketStatus} />
//         {/* Logs area */}
//         <ProcessLogs logs={process.logs} />
//       </div>
//       {/* Input area */}
//       {isRunning && (
//         <ProcessInput
//           inputValue={inputValue}
//           webSocketStatus={webSocketStatus}
//           onInputChange={handleInputChange}
//           onKeyPress={handleKeyPress}
//           onSubmit={handleInputSubmit}
//         />
//       )}
//       {/* Status alerts */}
//       {!isRunning && (
//         <Alert variant="secondary" className="m-3" style={{ flexShrink: 0 }}>
//           <Alert.Heading className="h6">Read-only Mode</Alert.Heading>
//           <small>
//             This process is no longer running. You can view the output logs but cannot send input.
//           </small>
//         </Alert>
//       )}
//     </div>
//   );
// };
