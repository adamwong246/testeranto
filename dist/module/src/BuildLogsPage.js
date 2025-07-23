"use strict";
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Alert, Badge } from 'react-bootstrap';
// type BuildLogs = {
//   errors: string[];
//   warnings: string[];
//   inputs: Record<string, any>;
//   outputs: Record<string, any>;
// };
// export const BuildLogsPage = () => {
//   const { projectName, runtime } = useParams<{ projectName: string; runtime: string }>();
//   const [logs, setLogs] = useState<BuildLogs | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   useEffect(() => {
//     const fetchBuildLogs = async () => {
//       try {
//         // Mock data - replace with actual API call
//         const mockLogs: BuildLogs = {
//           errors: [
//             "Error: Could not resolve './someModule'",
//             "TypeError: Cannot read property 'map' of undefined"
//           ],
//           warnings: [
//             "Warning: Circular dependency detected",
//             "Warning: Unused import"
//           ],
//           inputs: {
//             "src/lib/index.ts": {
//               bytes: 3565,
//               imports: []
//             }
//           },
//           outputs: {
//             "dist/bundle.js": {
//               bytes: 12345
//             }
//           }
//         };
//         setLogs(mockLogs);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBuildLogs();
//   }, [projectName, runtime]);
//   if (loading) return <div>Loading build logs...</div>;
//   if (error) return <Alert variant="danger">Error: {error}</Alert>;
//   return (
//     <div>
//       <h1>
//         Build Logs
//         <Badge bg="info" className="ms-2">{runtime}</Badge>
//         <Badge bg="secondary" className="ms-2">{projectName}</Badge>
//       </h1>
//       {logs ? (
//         <div>
//           <h2 className="mt-4">Errors</h2>
//           {logs.errors.length > 0 ? (
//             <div className="mb-4">
//               {logs.errors.map((err, i) => (
//                 <Alert key={i} variant="danger" className="mb-2">
//                   {err}
//                 </Alert>
//               ))}
//             </div>
//           ) : (
//             <Alert variant="success">No errors found</Alert>
//           )}
//           <h2 className="mt-4">Warnings</h2>
//           {logs.warnings.length > 0 ? (
//             <div className="mb-4">
//               {logs.warnings.map((warn, i) => (
//                 <Alert key={i} variant="warning" className="mb-2">
//                   {warn}
//                 </Alert>
//               ))}
//             </div>
//           ) : (
//             <Alert variant="success">No warnings found</Alert>
//           )}
//           <h2 className="mt-4">Input Files</h2>
//           <pre className="bg-light p-3">
//             {JSON.stringify(logs.inputs, null, 2)}
//           </pre>
//           <h2 className="mt-4">Output Files</h2>
//           <pre className="bg-light p-3">
//             {JSON.stringify(logs.outputs, null, 2)}
//           </pre>
//         </div>
//       ) : (
//         <Alert variant="warning">No build logs found</Alert>
//       )}
//     </div>
//   );
// };
